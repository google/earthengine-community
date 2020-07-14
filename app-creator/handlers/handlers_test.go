package handlers

import (
	"net/http"
	"net/http/httptest"
	"testing"
	"log"
	"os"
	"io/ioutil"
	"github.com/googleapis/google-cloud-go-testing/datastore/dsiface"
	"context"
	"cloud.google.com/go/datastore"
)

type mockClient struct {
	dsiface.Client
	m map[string]interface{}
}

func newMockClient() dsiface.Client {
	return &mockClient{
		m: make(map[string]interface{}),
	}
}

func TestGetTemplates(t *testing.T) {
	ctx := context.Background()

	req, err := http.NewRequest("GET", "localhost:8080/api/v1/templates", nil)
	if err != nil {
		t.Fatalf("could not create request: %v", err)
	}

	rec := httptest.NewRecorder()

	l := log.New(os.Stdout, "app-creator", log.LstdFlags)

	dbclient := newMockClient()

	query := datastore.NewQuery("Template")

	var dst dsiface.sourceData
	_, err = dbclient.GetAll(ctx, query, &dst)
	if err != nil {
		t.Fatal(err)
	}

	th := NewHandler(l, dbclient)

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

func (m *mockClient) GetAll(ctx context.Context, q *datastore.Query, dst interface{}) (keys []*datastore.Key, err error) {
	if q.Query != "Template" {
		return datastore.ErrNoSuchEntity
	}


}