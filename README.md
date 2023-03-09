# Private video handling API

This API allows for the storage and processing of private videos using AWS and Mux services. Fastify is used for improved performance, and the infrastructure layer is easy to set up.

## Prerequisites

Before you begin, ensure that you have the following installed:

-   Terraform CLI
-   Docker

## Getting Started

1. Clone this repository and navigate to the project folder.
2. Navigate to the `infra` folder and run `terraform init`, then `terraform apply`.
3. Choose a unique bucket name, author name, and region for the resources.
4. A `.env` file will be created automatically with the `AWS_BUCKET_NAME` and `AWS_REGION` fields filled in.
5. Add your `MUX_TOKEN_ID` and `MUX_TOKEN_SECRET` to the `.env` file (obtained from the Mux website).
6. Create a user with `AmazonS3FullAccess`, generate access keys for the user, and add the `AWS_ACCESS_KEY_ID` and `AWS_ACCESS_KEY_SECRET` to the `.env` file.
7. Create an environment variable `EXPIRATION_TIME` with the desired expiration time for the video link (e.g. 3h, 4h, 5h, 12h).
8. Build a Docker image named `video-aws-mux` from the Dockerfile in the project root using the command:

```bash
    docker build -t video-aws-mux .
```

9. Run the API using Docker Compose with the command:

```bash
    docker-compose up
```
"# aws-content-private-manager" 
"# aws-content-private-manager" 
