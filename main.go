package main

import (
	"encoding/json"
	"html/template"
	"io/fs"
	"log"
	"os"
	"strings"
	"sync"
	"time"
)

type Website struct {
	Title       string
	Description string

	ArticlesFS fs.FS
	Articles   []*Article
	Tags       []string
}

type Article struct {
	path string
	body string

	CreatedAt time.Time
	Title     string
	Slug      string
	Summary   string
	Tags      []string
	Category  string
}

type Templates struct {
	ArticlesIndex *template.Template
	ArticlesShow  *template.Template
}

func main() {
	articlesFS := os.DirFS("articles")
	templateFS := os.DirFS("pages")

	website := Website{
		ArticlesFS: articlesFS,
		Tags:       []string{},
	}

	allTemplates := template.Must(template.ParseFS(templateFS, "**/*.html", "*.html"))

	templates := Templates{
		ArticlesIndex: allTemplates.Lookup("articles_index.html"),
		ArticlesShow:  allTemplates.Lookup("articles_show.html"),
	}

	log.Printf("templates: %#v\n", templates)

	var wg sync.WaitGroup
	var errors []error
	var mut sync.Mutex

	fs.WalkDir(articlesFS, ".", func(path string, d fs.DirEntry, err error) error {
		if strings.HasSuffix(d.Name(), ".md") {
			wg.Add(1)

			go func() {
				defer wg.Done()

				article, err := processArticleFile(website.ArticlesFS, d.Name())
				if err != nil {
					mut.Lock()
					errors = append(errors, err)
					mut.Unlock()
					return
				}

				if err := buildArticlePage(templates, article); err != nil {
					mut.Lock()
					errors = append(errors, err)
					mut.Unlock()
					return
				}

				mut.Lock()
				website.Articles = append(website.Articles, article)
				mut.Unlock()
			}()
		}

		return nil
	})

	wg.Wait()

	for _, err := range errors {
		log.Printf("ERROR: failed to process article: %v\n", err)
	}

	if len(errors) != 0 {
		log.Println("Please fix errors")
		return
	}

	buildArticlesIndexPage(templates, website.Articles)

	log.Printf("Read %d articles\n", len(website.Articles))
	log.Printf("%#v\n", website)

	bytes, _ := json.MarshalIndent(website, "", "    ")
	println(string(bytes))
}
