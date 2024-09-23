package main

import (
	"fmt"
	"net/http"

	"github.com/go-chi/chi"
	"github.com/pytsx/beck_end/config"
)

func main() {
	fmt.Println("hello")
	if err := config.Load(); err != nil {
		panic(err)
	}


	router := chi.NewRouter()
	router.Get("/", func(res http.ResponseWriter, req *http.Request){})



	http.ListenAndServe(":"+config.GetServerPort(), router)
}