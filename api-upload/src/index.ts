import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { Hono } from 'hono'
import { basicAuth } from 'hono/basic-auth'
import { cors } from 'hono/cors'

type Bindings = {
  BASIC_AUTH_USERNAME: string,
  BASIC_AUTH_PASSWORD: string,
  ACCESS_KEY_ID_S3: string,
  SECRET_ACCESS_KEY_S3: string,
  ENDPOINT_S3: string,
  S3_BUCKET: string,
  S3_PUBLIC: string
}

const app = new Hono<{ Bindings: Bindings }>()

app.use(cors())

app.use(async (c, next) => {
  return basicAuth({
    username: c.env.BASIC_AUTH_USERNAME!,
    password: c.env.BASIC_AUTH_PASSWORD!,
  })
    (c, next)
})

app.post('/api/v1/upload', async (c) => {
  const form = await c.req.formData()
  const file = form.get('file') as File

  if (!file) {
    return c.json({ status: 'error: file is requiered' })
  }

  const S3 = new S3Client({
    region: 'auto',
    endpoint: c.env.ENDPOINT_S3,
    credentials: {
      accessKeyId: c.env.ACCESS_KEY_ID_S3,
      secretAccessKey: c.env.SECRET_ACCESS_KEY_S3,
    }
  })

  const fileBuffer = new Uint8Array(await file.arrayBuffer());
  const fileName = `${Date.now()}-${file.name}`.toLowerCase();

  const command = new PutObjectCommand({
    Bucket: c.env.S3_BUCKET,
    Key: fileName,
    Body: fileBuffer,
    ContentType: file.type,
  });

  await S3.send(command)
  const url = `${c.env.S3_PUBLIC}/${fileName}`

  return c.json({ status: 'success', url })
})

export default app
