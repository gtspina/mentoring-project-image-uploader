# mentoring-project-image-uploader

AWS Lambda study project, with the objective of learning to: run/deploy lambda with linux dependencies in windows environment and how to optimize this task (not creating resources manually or using "pure cloudformation").

Tools used:
- AWS Sam
- Docker
- [Yumda](https://github.com/lambci/yumda)

## Useful commands to run the project

Download dependencies with Yumda (see Yumda README.md for more details)
```
docker run --rm -v "$PWD"/dependencies:/lambda/opt lambci/yumda:2 yum install -y GraphicsMagick curl
```

Build
```
sam build
```

Prepare for packing/deploy (see Yumda README.md for more details)
```
cd dependencies
zip -yr ../dependencies.zip .
cd ..
```

Pack/Deploy
```
sam package   --template-file template.yml   --output-template-file package.yml   --s3-bucket source-project-bucket

sam deploy --template-file /home/image-resizer/package.yml --stack-name MentoringProjectGabriel-ImageUploader
```

PS: thanks to Gustavo Carpaneses for mentoring :)
