package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"log"
	"os"
	"io/ioutil"
	"cloud.google.com/go/datastore"
	"github.com/googleapis/google-cloud-go-testing/datastore/dsiface"
)

func TestGetTemplates(t *testing.T) {
	req, err := http.NewRequest("GET", "localhost:8080/api/v1/templates", nil)
	if err != nil {
		t.Fatalf("could not create request: %v", err)
	}

	rec := httptest.NewRecorder()

	l := log.New(os.Stdout, "app-creator", log.LstdFlags)

	db, err := datastore.NewClient(req.Context(), os.Getenv("GOOGLE_CLOUD_PROJECT"))
	if err != nil {
		t.Fatalf("Database connection failed: %v", err)
	}

	dbclient := dsiface.AdaptClient(db);

	th := New(l, dbclient)

	th.ServeHTTP(rec, req)

	res := rec.Result()
	defer res.Body.Close()
	if res.StatusCode != http.StatusOK {
		t.Errorf("expected status OK; got %v", res.StatusCode)
	}

	_, err = ioutil.ReadAll(res.Body)
	if err != nil {
		t.Fatalf("could not read response: %v", err)
	}
}