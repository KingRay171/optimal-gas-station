// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const coords = JSON.parse(req.body)
  fetch(`https://www.gasbuddy.com/gaspricemap/map?fuelTypeId=1&height=600&width=1265&maxLat=${coords.lat + .25}&maxLng=${coords.lng + .25}&minLat=${coords.lat - .25}&minLng=${coords.lng - .25}`,
  {
    method: "POST"
  }).then(data => data.json()).then(data => res.status(200).send(data))

}