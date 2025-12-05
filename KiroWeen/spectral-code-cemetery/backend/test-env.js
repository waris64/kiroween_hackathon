import dotenv from 'dotenv'

dotenv.config()

console.log('='.repeat(50))
console.log('Environment Variable Test')
console.log('='.repeat(50))
console.log('GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? '✓ FOUND' : '✗ NOT FOUND')
console.log('Key length:', process.env.GEMINI_API_KEY?.length || 0)
console.log('First 20 chars:', process.env.GEMINI_API_KEY?.substring(0, 20) || 'N/A')
console.log('PORT:', process.env.PORT)
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('='.repeat(50))
