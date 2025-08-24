import React, { useState, useEffect, useRef } from 'react'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase/firebase-config'
import { useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'

const Home = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState(null)
  const [showDropdown, setShowDropdown] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const user = auth.currentUser

  // Refs for scroll animations
  const page1Ref = useRef(null)
  const page2Ref = useRef(null)
  const page3Ref = useRef(null)
  const candlestickRef = useRef(null)

  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid))
          if (userDoc.exists()) {
            setUserData(userDoc.data())
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
    }

    fetchUserData()
  }, [user])

  // Scroll event handler for animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  // Scroll to specific section
  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className='bg-gray-100 overflow-x-hidden'>
      {/* Page 1: Hero Section with Candlestick Chart */}
      <div ref={page1Ref} className="min-h-screen relative">
        {/* Enhanced Navigation */}
        <nav className='w-full h-24 fixed top-0 left-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200'>
          <div className='flex w-full h-24 px-8'>
            <div className='w-1/6 h-full flex justify-center items-center'>
              <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl px-6 py-3 shadow-xl'>
                <p className='font-bold text-2xl text-white'>CF Pro</p>
              </div>
            </div>

            <div className='w-4/6 h-full flex justify-center items-center'>
              <div className='bg-gray-800 rounded-2xl px-8 py-4 flex items-center justify-evenly gap-12 border border-gray-700 shadow-xl'>
                <a href="#creators" className='text-white text-xl font-semibold hover:text-blue-200 transition-colors duration-200 hover:scale-105 transform'>For Creators</a>
                <a href="#browse" className='text-white text-xl font-semibold hover:text-blue-200 transition-colors duration-200 hover:scale-105 transform'>Browse Works</a>
                <a href="#about" className='text-white text-xl font-semibold hover:text-blue-200 transition-colors duration-200 hover:scale-105 transform'>About</a>
              </div>
            </div>

            <div className='w-1/6 h-full flex justify-center items-center space-x-4'>
              <div className='w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-200'>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <div className="relative">
                <button 
                  onClick={toggleDropdown}
                  className='w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-700 transition-colors duration-200'
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                
                {showDropdown && (
                  <div className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl z-10 border border-gray-200">
                    <div className="py-2">
                      <div className="px-4 py-3 text-sm text-gray-800 border-b border-gray-200">
                        <p className="font-semibold truncate">{userData?.username || 'User'}</p>
                        <p className="truncate text-gray-600">{user?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors rounded-lg mx-2"
                      >
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                          </svg>
                          Logout
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content - Candlestick Chart */}
        <main className='w-full min-h-screen flex items-center justify-center pt-24'>
          <div className='flex gap-2 justify-center items-center'>
            {/* Candlestick Chart Letters */}
            <div className='flex gap-2 items-end'>
              {/* CREATE - Blue outlined candlesticks */}
              <div className='flex flex-col items-center'>
                <div className='bg-white border-4 border-blue-500 w-16 h-20 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>C</span>
                </div>
                <div className='bg-blue-500 w-1 h-32'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-white border-4 border-blue-500 w-16 h-16 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>R</span>
                </div>
                <div className='bg-blue-500 w-1 h-24'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-white border-4 border-blue-500 w-16 h-32 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>E</span>
                </div>
                <div className='bg-blue-500 w-1 h-40'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-white border-4 border-blue-500 w-16 h-24 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>A</span>
                </div>
                <div className='bg-blue-500 w-1 h-28'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-white border-4 border-blue-500 w-16 h-28 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>T</span>
                </div>
                <div className='bg-blue-500 w-1 h-36'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-white border-4 border-blue-500 w-16 h-20 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>E</span>
                </div>
                <div className='bg-blue-500 w-1 h-32'></div>
              </div>
            </div>

            {/* INVEST/CROWDFUND - Black candlesticks */}
            <div className='flex gap-2 items-end'>
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-16 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>I</span>
                </div>
                <div className='bg-gray-800 w-1 h-24'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-20 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>N</span>
                </div>
                <div className='bg-gray-800 w-1 h-32'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-24 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>V</span>
                </div>
                <div className='bg-gray-800 w-1 h-28'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-16 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>E</span>
                </div>
                <div className='bg-gray-800 w-1 h-24'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-20 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>S</span>
                </div>
                <div className='bg-gray-800 w-1 h-32'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-24 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>T</span>
                </div>
                <div className='bg-gray-800 w-1 h-28'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-16 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>/</span>
                </div>
                <div className='bg-gray-800 w-1 h-24'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-20 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>C</span>
                </div>
                <div className='bg-gray-800 w-1 h-32'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-16 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>R</span>
                </div>
                <div className='bg-gray-800 w-1 h-24'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-20 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>O</span>
                </div>
                <div className='bg-gray-800 w-1 h-32'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-24 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>W</span>
                </div>
                <div className='bg-gray-800 w-1 h-28'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-16 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>D</span>
                </div>
                <div className='bg-gray-800 w-1 h-24'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-20 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>F</span>
                </div>
                <div className='bg-gray-800 w-1 h-32'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-24 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>U</span>
                </div>
                <div className='bg-gray-800 w-1 h-28'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-20 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>N</span>
                </div>
                <div className='bg-gray-800 w-1 h-32'></div>
              </div>
              
              <div className='flex flex-col items-center'>
                <div className='bg-gray-800 w-16 h-16 flex justify-center items-center shadow-2xl rounded-t-2xl'>
                  <span className='text-blue-500 font-bold text-4xl'>D</span>
                </div>
                <div className='bg-gray-800 w-1 h-24'></div>
              </div>
            </div>
          </div>
        </main>

        {/* Tagline */}
        <div className='absolute bottom-8 left-8 max-w-2xl'>
          <div className='bg-white/90 backdrop-blur-md rounded-3xl px-8 py-6 border border-gray-200 shadow-2xl'>
            <p className='text-3xl text-gray-800 font-light leading-relaxed'>
              Crowdfunding Meets Risk Intelligence – Where Every Investment <br /> 
              is an Informed Decision
            </p>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 animate-bounce'>
          <div className='w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center'>
            <div className='w-1 h-3 bg-gray-600 rounded-full mt-2 animate-pulse'></div>
          </div>
        </div>
      </div>

      {/* Page 2: Fresh Favorites Section */}
      <div ref={page2Ref} className="min-h-screen w-full py-16 bg-white">
        <div className='max-w-7xl mx-auto px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-6xl font-bold text-gray-800 mb-4 underline decoration-2 decoration-gray-600'>
              Fresh Favorites
            </h2>
            <div className='flex justify-center space-x-4 mt-6'>
              <button className='w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200'>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className='w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200'>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className='flex space-x-6 overflow-x-auto pb-8'>
            {/* Project Card 1 */}
            <div className='min-w-80 bg-white border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden'>
              <div className='relative'>
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop" alt="Teamwork" className='w-full h-48 object-cover' />
                <div className='absolute top-4 left-4'>
                  <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </div>
                <div className='absolute top-4 right-4'>
                  <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>Title Of The Product</h3>
                    <div className='flex items-center text-gray-600 mb-2'>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      15 Days Left
                    </div>
                    <div className='text-blue-600 font-semibold'>75% Funded</div>
                  </div>
                  <div className='text-right text-gray-600 text-sm max-w-32'>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                  </div>
                </div>
              </div>
            </div>

            {/* Project Card 2 */}
            <div className='min-w-80 bg-white border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden'>
              <div className='relative'>
                <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop" alt="Teamwork" className='w-full h-48 object-cover' />
                <div className='absolute top-4 left-4'>
                  <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </div>
                <div className='absolute top-4 right-4'>
                  <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>Innovation Hub</h3>
                    <div className='flex items-center text-gray-600 mb-2'>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      8 Days Left
                    </div>
                    <div className='text-blue-600 font-semibold'>92% Funded</div>
                  </div>
                  <div className='text-right text-gray-600 text-sm max-w-32'>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                  </div>
                </div>
              </div>
            </div>

            {/* Project Card 3 */}
            <div className='min-w-80 bg-white border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden'>
              <div className='relative'>
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" alt="Financial Chart" className='w-full h-48 object-cover' />
                <div className='absolute top-4 left-4'>
                  <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </div>
                <div className='absolute top-4 right-4'>
                  <div className='w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center'>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className='p-6'>
                <div className='flex justify-between items-start mb-4'>
                  <div>
                    <h3 className='text-xl font-bold text-gray-800 mb-2'>Tech Startup</h3>
                    <div className='flex items-center text-gray-600 mb-2'>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      22 Days Left
                    </div>
                    <div className='text-blue-600 font-semibold'>45% Funded</div>
                  </div>
                  <div className='text-right text-gray-600 text-sm max-w-32'>
                    Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page 3: Meet The Creators Section */}
      <div ref={page3Ref} className="min-h-screen w-full py-16 bg-gray-50">
        <div className='max-w-7xl mx-auto px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-6xl font-bold text-gray-800 mb-4 underline decoration-2 decoration-gray-600'>
              Meet The Creators
            </h2>
            <div className='flex justify-center space-x-4 mt-6'>
              <button className='w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200'>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className='w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors duration-200'>
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
            {/* Creator Card 1 */}
            <div className='bg-white border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden'>
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop" alt="Engineer" className='w-full h-48 object-cover' />
              <div className='p-6'>
                <p className='text-gray-600 mb-4'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
                <div className='text-right'>
                  <a href="#readmore" className='text-blue-600 hover:text-blue-700 font-medium'>Read More</a>
                </div>
              </div>
            </div>

            {/* Creator Card 2 */}
            <div className='bg-white border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden'>
              <img src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop" alt="Finance Professional" className='w-full h-48 object-cover' />
              <div className='p-6'>
                <p className='text-gray-600 mb-4'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
                <div className='text-right'>
                  <a href="#readmore" className='text-blue-600 hover:text-blue-700 font-medium'>Read More</a>
                </div>
              </div>
            </div>

            {/* Creator Card 3 */}
            <div className='bg-white border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden'>
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=300&fit=crop" alt="Designer" className='w-full h-48 object-cover' />
              <div className='p-6'>
                <p className='text-gray-600 mb-4'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
                <div className='text-right'>
                  <a href="#readmore" className='text-blue-600 hover:text-blue-700 font-medium'>Read More</a>
                </div>
              </div>
            </div>

            {/* Creator Card 4 */}
            <div className='bg-white border-2 border-blue-500 rounded-2xl shadow-xl overflow-hidden'>
              <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop" alt="Analyst" className='w-full h-48 object-cover' />
              <div className='p-6'>
                <p className='text-gray-600 mb-4'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
                <div className='text-right'>
                  <a href="#readmore" className='text-blue-600 hover:text-blue-700 font-medium'>Read More</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How To Section */}
      <div className="min-h-screen w-full py-16 bg-white">
        <div className='max-w-7xl mx-auto px-8'>
          <div className='text-center mb-16'>
            <h2 className='text-6xl font-bold text-gray-800 mb-4 underline decoration-2 decoration-gray-600'>
              Steps On How To
            </h2>
          </div>
          
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16'>
            {/* Left Column: Create A Project */}
            <div className='relative'>
              <div className='absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-full bg-gray-800'></div>
              <div className='relative'>
                <h3 className='text-4xl font-bold text-gray-800 mb-8 underline decoration-2 decoration-gray-600'>
                  Create A Project
                </h3>
                
                <div className='space-y-8'>
                  <div className='flex items-center space-x-6'>
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=150&fit=crop" alt="Teamwork" className='w-48 h-32 object-cover rounded-lg border-2 border-gray-300' />
                    <div className='flex-1'>
                      <h4 className='text-xl font-semibold text-gray-800 mb-2'>Step One</h4>
                      <p className='text-gray-600'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
                    </div>
                  </div>
                  
                  <div className='flex items-center space-x-6'>
                    <div className='flex-1 text-right'>
                      <h4 className='text-xl font-semibold text-gray-800 mb-2'>Step Two</h4>
                      <p className='text-gray-600'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
                    </div>
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=150&fit=crop" alt="Teamwork" className='w-48 h-32 object-cover rounded-lg border-2 border-gray-300' />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Fund A Project */}
            <div className='relative'>
              <h3 className='text-4xl font-bold text-gray-800 mb-8 underline decoration-2 decoration-gray-600'>
                Fund A Project
              </h3>
              
              <div className='space-y-8'>
                <div className='flex items-center space-x-6'>
                  <div className='flex-1'>
                    <h4 className='text-xl font-semibold text-gray-800 mb-2'>Step One</h4>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
                  </div>
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=150&fit=crop" alt="Teamwork" className='w-48 h-32 object-cover rounded-lg border-2 border-gray-300' />
                </div>
                
                <div className='flex items-center space-x-6'>
                  <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=200&h=150&fit=crop" alt="Teamwork" className='w-48 h-32 object-cover rounded-lg border-2 border-gray-300' />
                  <div className='flex-1'>
                    <h4 className='text-xl font-semibold text-gray-800 mb-2'>Step Three</h4>
                    <p className='text-gray-600'>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home