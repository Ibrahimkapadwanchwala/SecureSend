import rateLimit from 'express-rate-limit';
const loginRateLimiter=rateLimit({
    windowMs:10*60*1000,
    max:10,
    standardHeaders:true,
    legacyHeaders:false,
    message:{
        message:"Too many login attempts. Try again after 10 minutes"
    }
})

export default loginRateLimiter