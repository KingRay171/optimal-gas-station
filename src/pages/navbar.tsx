import React, {MouseEventHandler, useEffect, useState} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEnvelope, faGear, faList, faMapLocationDot, faRotateRight } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"

export default function Nav({onClick} : {onClick : MouseEventHandler}) {


    const [activeIdx, setActiveIdx] = useState(-1);
    return (
        <div className="flex h-[10vh]">
            <Link className='w-1/4 flex justify-center items-center' href="/">
                <FontAwesomeIcon icon={faMapLocationDot} className='w-[4vw] h-auto'/>
            </Link>
            <Link className='w-1/4 flex justify-center items-center' href="/list">
                <FontAwesomeIcon icon={faList} className='w-[4vw] h-auto' />
            </Link>
            <Link className='w-1/4 flex justify-center items-center' href="/settings">
                <FontAwesomeIcon icon={faGear} className='w-[4vw] h-auto' />
            </Link>
            <button className='w-1/4 flex justify-center items-center' onClick={onClick}>
                <FontAwesomeIcon icon={faRotateRight} className='w-[4vw] h-auto' />
            </button>
        </div>
    )
}