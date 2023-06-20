import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const coords = JSON.parse(req.body)
  const link = `https://maps.googleapis.com/maps/api/distancematrix/json?destinations=${coords.destLat},${coords.destLng}&origins=${coords.currentLat},${coords.currentLng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
  console.log(link)
  fetch(
    link
    ).then(data => data.json()).then(data => res.status(200).send(data))

}