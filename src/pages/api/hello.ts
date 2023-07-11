// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

type GoogleDistMatrixRow = {
  elements: Array<{distance: {text: any, value: number}, duration: {text: string, value: number}}>
}

type GoogleResponse = {
  destination_addresses: Array<string>
  origin_addresses: Array<string>
  rows: Array<GoogleDistMatrixRow>
}

type Station = {
  id: number
  lat: number
  lng: number
  price: number
  distance: number
  distanceAdjPrice: number

}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  const coords = JSON.parse(req.body)
  let firstResult = await fetch(`https://www.gasbuddy.com/gaspricemap/map?fuelTypeId=1&height=600&width=1265&maxLat=${coords.lat + .125}&maxLng=${coords.lng + .15}&minLat=${coords.lat - .125}&minLng=${coords.lng - .15}`,
  {
    method: "POST"
  })
  let secondResult = await firstResult.json()
  let thirdResult = secondResult.primaryStations.concat(secondResult.secondaryStations).filter((e: {id: number, lat: number, lng: number, price: string}) => e.price !== "--")

  let distMatURL = "https://maps.googleapis.com/maps/api/distancematrix/json?destinations="

  let urls = new Array(Math.ceil(thirdResult.length / 25)).fill(0)

  urls.forEach((e, idx, arr) => {
    arr[idx] = distMatURL
    if(idx !== arr.length - 1){
      for(let i = 0; i < 25; i++){
        arr[idx] += `${thirdResult[idx * 25 + i].lat},${thirdResult[idx * 25 + i].lng}|`
      }
      
    } else {
      for(let i = idx * 25; i < thirdResult.length; i++){
        arr[idx] += `${thirdResult[i].lat},${thirdResult[i].lng}|`
      }
      
    }
    arr[idx] += `&origins=${coords.lat},${coords.lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`
  })

  let test: Array<Array<number>> = await Promise.all(urls.map(async (e) => {
    let urlResult = await fetch(e)
    let urlResult2: GoogleResponse = await urlResult.json()
    let urlResult3: Array<number> = []
    urlResult2.rows[0].elements.forEach((e, idx, arr) => urlResult3.push(parseFloat(e.distance.text.split(" ")[0])))
    return urlResult3
  }))

  let flattenedTest = test.flat()

  for(let i = 0; i < thirdResult.length; i++){
    thirdResult[i].distance = flattenedTest[i]
    thirdResult[i].price = parseFloat(thirdResult[i].price)
    thirdResult[i].distanceAdjPrice = Math.round(100 * (thirdResult[i].price + ((thirdResult[i].price * thirdResult[i].distance / 36) / 14))) / 100
  }

  thirdResult.sort((a: Station, b: Station) => a.distanceAdjPrice - b.distanceAdjPrice)

  res.status(200).send(thirdResult)

}