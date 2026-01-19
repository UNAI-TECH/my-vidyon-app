
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkUser() {
    const email = 'kamalesh.s@myvidyon.edu'
    console.log(`Checking student with email: ${email}`)

    const { data: student, error: sError } = await supabase
        .from('students')
        .select('*')
        .ilike('email', email)
        .maybeSingle()

    if (sError) console.error('Student fetch error:', sError)
    console.log('Student result:', student)

    if (student) {
        const today = new Date().toISOString().split('T')[0]
        const { data: attendance, error: aError } = await supabase
            .from('student_attendance')
            .select('*')
            .eq('student_id', student.id)
            .eq('attendance_date', today)

        if (aError) console.error('Attendance fetch error:', aError)
        console.log('Today Attendance:', attendance)

        const { data: allAtt } = await supabase
            .from('student_attendance')
            .select('*')
            .eq('student_id', student.id)
        console.log('Total attendance records:', allAtt?.length)
    }
}

checkUser()
