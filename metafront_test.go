package main

import (
	"testing"
	"time"

	"github.com/google/go-cmp/cmp"
)

func TestMetaFrontParsing(t *testing.T) {
	given := `
	string: some string
	array: [one, two, three]
	time: @04/10/2022
	integer: #12
	`

	want := map[string]interface{}{
		"string":  "some string",
		"array":   []string{"one", "two", "three"},
		"time":    time.Date(2022, 10, 4, 0, 0, 0, 0, time.UTC),
		"integer": 12,
	}

	got, err := parseMetaFront(given)
	if err != nil {
		t.Error("there should be no errors")
	}

	for key, value := range want {
		if !cmp.Equal(got[key], value) {
			t.Errorf("want %s to be %#v, got %#v", key, value, got[key])
		}
	}
}
