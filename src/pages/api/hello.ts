// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  fetch("https://www.gasbuddy.com/gaspricemap/map?fuelTypeId=1&height=600&width=1265&maxLat=45.40307408555111&maxLng=-75.72397054133633&minLat=45.31101409445494&minLng=-75.83098073480714",
  {
    method: "POST"
  }).then(data => data.json()).then(data => res.status(200).json(data))

}
