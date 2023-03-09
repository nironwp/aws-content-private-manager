resource "aws_s3_bucket" "my_bucket" {
  bucket = "${var.bucket_name}-content-videos"


  lifecycle {
    prevent_destroy = false
  }
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }

  provisioner "local-exec" {
    command = "echo 'AWS_BUCKET_NAME=${aws_s3_bucket.my_bucket.id}\nAWS_REGION=${var.region}' > ../.env"
  }
}

resource "aws_s3_bucket_object" "bucket_objects" {
  bucket = aws_s3_bucket.my_bucket.id

  for_each = aws_s3_bucket_object.bucket_objects

  key = each.value.key

  depends_on = [aws_s3_bucket_policy.my_bucket_policy]
}

data "aws_s3_bucket_objects" "bucket_objects" {
  bucket = aws_s3_bucket.my_bucket.id

  depends_on = [aws_s3_bucket_policy.my_bucket_policy]
}

resource "null_resource" "bucket_cleanup" {
  depends_on = [aws_s3_bucket_object.bucket_objects]

  provisioner "local-exec" {
    command = "aws s3 rm s3://${aws_s3_bucket.my_bucket.id} --recursive"
  }
}


resource "aws_s3_bucket_policy" "my_bucket_policy" {
  bucket = aws_s3_bucket.my_bucket.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect    = "Allow"
        Principal = "*"
        Action = [
          "s3:GetObject"
        ]
        Resource = [
          "${aws_s3_bucket.my_bucket.arn}/*"
        ]
      }
    ]
  })
}


output "bucket_name" {
  value = aws_s3_bucket.my_bucket.bucket
}


resource "aws_iam_policy" "my_policy" {
  name = "my-policy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Effect = "Allow"
        Resource = [
          "${aws_s3_bucket.my_bucket.arn}",
          "${aws_s3_bucket.my_bucket.arn}/*"
        ]
      }
    ]
  })
}
