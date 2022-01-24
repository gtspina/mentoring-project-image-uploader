const { v4: uuidv4 } = require('uuid')
const gm = require('gm')
const fs = require('fs')
const { execSync } = require('child_process')

const AWS = require('aws-sdk')
const s3 = new AWS.S3({ apiVersion: '2006-03-01' })

const shell = cmd => execSync(cmd, { cwd: '/tmp', encoding: 'utf8', stdio: 'inherit' })

const bucketName = 'mentoringprojectgabriel-uploadedfiles'
const originFilename = '/tmp/origin_file.jpg'
const outputFilename = '/tmp/thumb.jpg'

exports.lambdaHandler = async (event, context) => {
    try {
        if (!event.body)
            return {
                'headers': { 'Content-Type': 'application/json' },
                'isBase64Encoded': false,
                'statusCode': 400,
                'body': JSON.stringify({
                    'error': "File not exists"
                })
            }

        let imageAsBase64 = event.body
        let binaryData = new Buffer(imageAsBase64, 'base64')

        fs.writeFileSync(originFilename, binaryData)

        shell(`gm convert -background black ${originFilename} -resize 100x100 -gravity Center -extent 100x100 ${outputFilename}`)

        let image = fs.readFileSync(outputFilename)
        let id = uuidv4()

        await s3.putObject({
            ACL: 'public-read',
            Bucket: bucketName,
            Key: `${id}`,
            Body: image,
            ContentType: 'image/jpeg',
        }, (err, success) => {
            if (err) {
                console.error(err)
                throw Error(err)
            }
            console.log(success)
        }).promise()

        return {
            'headers': { 'Content-Type': 'application/json' },
            'isBase64Encoded': false,
            'statusCode': 200,
            'body': JSON.stringify({
                'id': id,
                'content-type': 'image/jpg',
                'url': `http://${bucketName}.s3.amazonaws.com/${id}`
            })
        }

    } catch (err) {
        console.log(err)
        return err
    }
}