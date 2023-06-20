import React, {MouseEventHandler, useEffect, useState} from 'react'
import Link from "next/link"

export default function Nav({onClick} : {onClick : MouseEventHandler}) {


    const [activeIdx, setActiveIdx] = useState(-1);
    return (
        <div className="flex">
            <Link className='w-1/4  place-self-center' href="/">
                <p onClick={onClick}>Map</p>
            </Link>
            <Link className='w-1/4 place-self-center' href="/list">
                <p>List</p>
            </Link>
            <Link className='w-1/4 place-self-center' href="/settings">
                <p>Settings</p>
            </Link>
            <button className='w-1/4 place-self-center' onClick={onClick}>
                Refresh
            </button>
        </div>
    )
}