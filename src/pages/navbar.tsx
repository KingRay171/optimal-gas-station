import React, {useEffect, useState} from 'react'
import Link from "next/link"

export default function Nav({onClick}) {


    const [activeIdx, setActiveIdx] = useState(-1);
    return (
        <div className="flex">
            <Link className='w-1/3 place-self-center' href="/">
                <p onClick={onClick}>Map</p>
            </Link>
            <Link className='w-1/3 place-self-center' href="/list">
                <p>List</p>
            </Link>
            <Link className='w-1/3 place-self-center' href="/settings">
                <p>Settings</p>
            </Link>
        </div>
    )
}