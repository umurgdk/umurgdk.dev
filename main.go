package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"io"
	"io/fs"
	"log"
	"os"
	"strings"
	"time"

	yaml "gopkg.in/yaml.v3"
)

type Website struct {
	Title       string
	Description string

	ArticlesFS fs.FS
	Articles   []Article
	Tags       []string
}

type Article struct {
	path string
	body string

	CreatedAt ArticleTime
	Title     string
	Summary   string
	Tags      []string
	Category  string
}

type ArticleTime struct {
	Time time.Time
}

func (t *ArticleTime) UnmarshalYAML(unmarshal func(interface{}) error) error {
	var buffer string
	if err := unmarshal(&buffer); err != nil {
		return err
	}

	articleTime, err := time.Parse("02/01/2006", strings.TrimSpace(buffer))
	if err != nil {
		return err
	}

	t.Time = articleTime
	return nil
}

func main() {
	articlesFS := os.DirFS("articles")

	website := Website{
		ArticlesFS: articlesFS,
		Tags:       []string{},
	}

	fs.WalkDir(articlesFS, ".", func(path string, d fs.DirEntry, err error) error {
		if strings.HasSuffix(d.Name(), ".md") {
			if err := processArticleFile(&website, d.Name()); err != nil {
				log.Printf("error: %s: %v\n", d.Name(), err)
				return nil
			}
		}

		return nil
	})

	log.Printf("Read %d articles\n", len(website.Articles))
	log.Printf("%#v\n", website)

	bytes, _ := json.MarshalIndent(website, "", "    ")
	println(string(bytes))
}

func processArticleFile(website *Website, path string) error {
	file, err := website.ArticlesFS.Open(path)
	if err != nil {
		return err
	}
	defer file.Close()

	article := Article{path: path}

	reader := bufio.NewReader(file)
	if err := readMetaFront(&article, reader); err != nil {
		return fmt.Errorf("metafront: %v", err)
	}

	// Empty line after yaml front
	reader.ReadString('\n')

	body, err := io.ReadAll(reader)
	if err != nil {
		return fmt.Errorf("read body: %v", err)
	}

	article.body = string(body)

	website.Articles = append(website.Articles, article)
	return nil
}

func readMetaFront(article *Article, reader *bufio.Reader) error {
	var metaFront string
	var scanErr error
	var line string

	firstLine, err := reader.ReadString('\n')
	if err != nil {
		return fmt.Errorf("read: %v", err)
	} else if strings.TrimSpace(firstLine) != "---" {
		return fmt.Errorf("not found")
	}

	for scanErr == nil {
		line, scanErr = reader.ReadString('\n')

		if strings.TrimSpace(line) == "---" {
			break
		}

		metaFront += line
	}

	if scanErr != nil {
		return fmt.Errorf("read: %v", scanErr)
	}

	return yaml.Unmarshal([]byte(metaFront), &article)
}
