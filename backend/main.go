package main

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"github.com/jung-kurt/gofpdf"
	"github.com/rs/cors"
)

var client *mongo.Client

type Resume struct {
	Name  string `json:"name"`
	Email string `json:"email"`
	Phone string `json:"phone"`
	// Add other fields as necessary
}

func main() {
	// Connect to MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	clientOptions := options.Client().ApplyURI("mongodb://localhost:27017")
	var err error
	client, err = mongo.Connect(ctx, clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	router := mux.NewRouter()
	router.HandleFunc("/api/resume", CreateResumeEndpoint).Methods("POST")
	handler := cors.Default().Handler(router)

	log.Println("Server is running on port 8080")
	log.Fatal(http.ListenAndServe(":8080", handler))
}

func CreateResumeEndpoint(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	var resume Resume
	_ = json.NewDecoder(r.Body).Decode(&resume)
	collection := client.Database("resume_builder").Collection("resumes")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	collection.InsertOne(ctx, resume)

	// Generate PDF
	pdf := gofpdf.New("P", "mm", "A4", "")
	pdf.AddPage()
	pdf.SetFont("Arial", "B", 16)
	pdf.Cell(40, 10, "Name: "+resume.Name)
	pdf.Ln(12)
	pdf.Cell(40, 10, "Email: "+resume.Email)
	pdf.Ln(12)
	pdf.Cell(40, 10, "Phone: "+resume.Phone)
	// Add more fields as necessary

	err := pdf.Output(w)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}
