package main

import (
	"bufio"
	"fmt"
	"io"
	"io/fs"
	"strconv"
	"strings"
	"time"
)

func processArticleFile(dir fs.FS, path string) (*Article, error) {
	file, err := dir.Open(path)
	if err != nil {
		return nil, err
	}
	defer file.Close()

	article := &Article{path: path}

	reader := bufio.NewReader(file)
	metaFront, err := readMetaFront(reader)
	if err != nil {
		return nil, fmt.Errorf("metafront: %v", err)
	}

	article.Category = metaFront["category"].(string)
	article.CreatedAt = metaFront["createdAt"].(time.Time)
	article.Summary = metaFront["summary"].(string)
	article.Tags = metaFront["tags"].([]string)
	article.Title = metaFront["title"].(string)
	article.Slug = metaFront["slug"].(string)

	// Empty line after yaml front
	reader.ReadString('\n')

	body, err := io.ReadAll(reader)
	if err != nil {
		return nil, fmt.Errorf("read body: %v", err)
	}

	article.body = string(body)
	return article, nil
}

func readMetaFront(reader *bufio.Reader) (map[string]interface{}, error) {
	var metaFront string
	var scanErr error
	var line string

	firstLine, err := reader.ReadString('\n')
	if err != nil {
		return nil, fmt.Errorf("read: %v", err)
	} else if strings.TrimSpace(firstLine) != "---" {
		return nil, fmt.Errorf("not found")
	}

	for scanErr == nil {
		line, scanErr = reader.ReadString('\n')

		if strings.TrimSpace(line) == "---" {
			break
		}

		metaFront += line
	}

	if scanErr != nil {
		return nil, fmt.Errorf("read: %v", scanErr)
	}

	return parseMetaFront(metaFront)
}

func parseMetaFront(content string) (map[string]interface{}, error) {
	bytesReader := strings.NewReader(content)
	scanner := bufio.NewScanner(bytesReader)

	var meta = map[string]interface{}{}
	for scanner.Scan() {
		line := scanner.Text()
		if strings.TrimSpace(line) == "" {
			continue
		}

		parts := strings.Split(line, ":")

		if len(parts) != 2 {
			return nil, fmt.Errorf("invalid meta front, line: %s", line)
		}

		key := strings.TrimSpace(parts[0])
		valuePart := strings.TrimSpace(parts[1])

		if len(valuePart) == 0 {
			return nil, fmt.Errorf("missing value, line: %s", line)
		}

		switch valuePart[0] {
		case '[':
			if valuePart[len(valuePart)-1] != ']' {
				return nil, fmt.Errorf("missing closing bracket, line: %s", line)
			}

			values := strings.Split(valuePart[1:len(valuePart)-1], ",")
			for i, _ := range values {
				values[i] = strings.TrimSpace(values[i])
			}

			meta[key] = values

		case '#':
			value, err := strconv.Atoi(valuePart[1:])
			if err != nil {
				return nil, fmt.Errorf("not a valid number, line: %s", line)
			}

			meta[key] = value

		case '@':
			value, err := time.Parse("02/01/2006", valuePart[1:])
			if err != nil {
				return nil, fmt.Errorf("not a valid date, line: %s", line)
			}

			meta[key] = value

		default:
			meta[key] = valuePart
		}
	}

	return meta, nil
}
