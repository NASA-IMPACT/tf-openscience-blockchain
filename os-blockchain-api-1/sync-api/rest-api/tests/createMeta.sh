curl -v -F username=edge -F file=@image.txt -F name=test "http://localhost:3000/metadata" -H "Content-Type: multipart/form-data"