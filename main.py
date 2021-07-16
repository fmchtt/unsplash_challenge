import uvicorn 

if __name__ == "__main__":
    uvicorn.run("api_images.main:app", port=3000, reload=True)
