'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronRight } from 'lucide-react'

export  function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  const toggleForm = () => {
    setIsLogin(!isLogin)
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 overflow-hidden">
      <div className="relative w-full max-w-4xl h-[600px] bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 w-1/2 h-full"
          initial={false}
          animate={{ x: isLogin ? '0%' : '-100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Image
            src="/images/Login.jpg"
            alt="Login background"
            layout="fill"
            objectFit="cover"
            
          />
        </motion.div>
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full"
          initial={false}
          animate={{ x: isLogin ? '100%' : '0%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <Image
            src="/images/Register.jpg"
            alt="Register background"
            layout="fill"
            objectFit="cover"
          />
        </motion.div>

        <div className="absolute top-0 left-0 w-full h-full flex">
          <motion.div
            className="w-1/2 p-8 flex items-center"
            initial={false}
            animate={{ x: isLogin ? '0%' : '-100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="w-full max-w-md mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-white bg-blue-800/90 inline-block px-4 py-2 rounded-lg">Login</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="login-email" className="text-gray-300">Email</Label>
                  <Input id="login-email" type="email" placeholder="Enter your email" className="bg-gray-700 text-white border-gray-600" />
                </div>
                <div>
                  <Label htmlFor="login-password" className="text-gray-300">Password</Label>
                  <Input id="login-password" type="password" placeholder="Enter your password" className="bg-gray-700 text-white border-gray-600" />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Log In</Button>
              </form>
            </div>
          </motion.div>

          <motion.div
            className="w-1/2 p-8 flex items-center"
            initial={false}
            animate={{ x: isLogin ? '100%' : '0%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            <div className="w-full max-w-md mx-auto">
              <h2 className="text-3xl font-bold mb-6 text-white bg-blue-800/90 inline-block px-4 py-2 rounded-lg">Register</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="register-name" className="text-gray-300">Name</Label>
                  <Input id="register-name" type="text" placeholder="Enter your name" className="bg-gray-700 text-white border-gray-600" />
                </div>
                <div>
                  <Label htmlFor="register-email" className="text-gray-300">Email</Label>
                  <Input id="register-email" type="email" placeholder="Enter your email" className="bg-gray-700 text-white border-gray-600" />
                </div>
                <div>
                  <Label htmlFor="register-password" className="text-gray-300">Password</Label>
                  <Input id="register-password" type="password" placeholder="Create a password" className="bg-gray-700 text-white border-gray-600" />
                </div>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">Register</Button>
              </form>
            </div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 w-full bg-gray-700 p-4">
          <Button
            variant="ghost"
            className="w-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-gray-600"
            onClick={toggleForm}
          >
            {isLogin ? 'Need an account? Register' : 'Already have an account? Login'}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}