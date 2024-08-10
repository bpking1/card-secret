docker buildx build --platform=linux/arm64 -f ./dockerfile-arm . --output .
docker build -f dockerfile . --output .
