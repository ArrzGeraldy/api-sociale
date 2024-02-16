import express, { NextFunction, Request, Response } from 'express'
import { routes } from './routes'
import 'dotenv/config'
import './utils/connectDB'
import setupMiddleware from './middleware/setupMiddleware'
import deserialiedToken from './middleware/deserializedToken'
import multer from 'multer'
import { handleFileSizeError } from './middleware/multer'

const app = express()
const PORT = 4000

// middleware: cors,body-parser,
setupMiddleware(app)

app.use(deserialiedToken)
app.get('/', (req, res) => {
  res.send('hello world')
})
// eslint-disable-next-line @typescript-eslint/no-explicit-any
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).send('File size too large')
  }
  next(err)
})
// run app
routes(app)
app.use(handleFileSizeError)

app.listen(PORT, () => console.log('server listen on port', PORT))
