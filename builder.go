package main

import (
	"bufio"
	"fmt"
	"os"
)

func buildArticlePage(templates Templates, article *Article) error {
	os.MkdirAll("output/articles/", 0700)
	outPath := fmt.Sprintf("output/articles/%s.html", article.Slug)
	file, err := os.Create(outPath)
	if err != nil {
		return err
	}

	writer := bufio.NewWriter(file)
	return templates.ArticlesShow.Execute(writer, article)
}

func buildArticlesIndexPage(templates Templates, articles []*Article) error {
	os.MkdirAll("output/articles/", 0700)
	file, err := os.Create("output/articles/index.html")
	if err != nil {
		return err
	}

	writer := bufio.NewWriter(file)
	return templates.ArticlesIndex.Execute(writer, articles)
}
