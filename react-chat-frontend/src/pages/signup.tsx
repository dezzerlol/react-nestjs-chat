import { GetServerSideProps, NextPageContext } from 'next'
import { useRouter } from 'next/router'
import { NextRequest } from 'next/server'
import React, { useState } from 'react'

const SignupPage = () => {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async () => {
    const data = {
      username,
      password,
    }

    const res = await fetch('http://localhost:5000/auth/signup', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })

    if (res.ok) {
      router.replace(`/chat/${data.username}`)
    }
  }

  return (
    <div className='w-screen h-screen bg-gray-200 flex flex-col items-center justify-center'>
      <h1>Signup page</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
        <input onChange={(e) => setUsername(e.target.value)} placeholder='Username' />
        <input onChange={(e) => setPassword(e.target.value)} placeholder='Password' />
        <button type='submit' className='bg-blue-300'>
          Submit
        </button>
      </form>
    </div>
  )
}

export default SignupPage

export const getServerSideProps = async ({ req }: any) => {
  const cookie = req.cookies['REFRESH_TOKEN']

  if (cookie) {
    return {
      redirect: {
        permanent: false,
        destination: '/chat',
      },
    }
  }
  return {
    props: {},
  }
}
