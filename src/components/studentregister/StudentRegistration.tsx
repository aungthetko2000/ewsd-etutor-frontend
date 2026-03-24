import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Mail, 
  IdCard, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Loader2,
  Camera,
  X
} from 'lucide-react';

import { studentApi } from '../../service/student/StudentApi';

// --- Types ---
export interface RegistrationResponse {
  success: boolean;
  message: string;
  user?: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  fatherName?: string;
  email?: string;
  password?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  course?: string;
  grade?: string;
  enrollmentDate?: string;
  photo?: string;
}

/**
 * StudentRegistration - The main point of the registration screen
 */
export default function StudentRegistration() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    fatherName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    gender: '',
    address: '',
    emergencyContact: '',
    course: '',
    grade: '',
    enrollmentDate: '',
    photo: '' // This will now store the base64 string
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [response, setResponse] = useState<RegistrationResponse | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    const required = [
      'firstName', 'lastName', 'fatherName', 'email', 'password', 
      'phone', 'dob', 'gender', 'address', 'emergencyContact', 
      'course', 'grade', 'enrollmentDate'
    ];
    
    required.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        newErrors[field as keyof FormErrors] = 'Required';
      }
    });

    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Invalid email';
    }
    
    if (formData.password && !/^\d{6}$/.test(formData.password)) {
      newErrors.password = 'Must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setResponse(null);

    try {
      // Create student via API
      await studentApi.registerStudent({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        age: new Date().getFullYear() - new Date(formData.dob).getFullYear(),
        grade: formData.grade
      });
      
      const successResponse: RegistrationResponse = {
        success: true,
        message: `Welcome, ${formData.firstName}! Your registration for ${formData.course} has been received.`,
        user: { 
          firstName: formData.firstName, 
          lastName: formData.lastName, 
          email: formData.email 
        }
      };

      setResponse(successResponse);
      setFormData({
        firstName: '', lastName: '', fatherName: '', email: '', password: '',
        phone: '', dob: '', gender: '', address: '', emergencyContact: '',
        course: '', grade: '', enrollmentDate: '', photo: ''
      });
    } catch (err) {
      setResponse({ success: false, message: 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, photo: 'File size must be less than 2MB' }));
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result as string }));
        setErrors(prev => ({ ...prev, photo: undefined }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F2] py-12 px-4 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-[#FF6B35]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-[#FF3D68]/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-4xl mx-auto"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF3D68] rounded-3xl shadow-lg shadow-orange-200 mb-6">
            <GraduationCap className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-[#1A202C] tracking-tight">Student Registration</h1>
          <p className="text-gray-500 mt-2 font-medium">Complete the form below to enroll in the portal</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-white p-10">
          <AnimatePresence mode="wait">
            {response?.success ? (
              <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Enrollment Successful!</h2>
                <p className="text-gray-600 mb-8 text-lg">{response.message}</p>
                <button 
                  onClick={() => setResponse(null)} 
                  className="px-10 py-4 bg-gradient-to-r from-[#FF6B35] to-[#FF3D68] text-white rounded-2xl font-bold shadow-lg shadow-orange-200 hover:opacity-90 transition-all"
                >
                  Register Another Student
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="space-y-10">
                
                {/* Section 1: Personal Information */}
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <User className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    Personal Information
                  </h3>
                  
                  {/* Photo Upload Section */}
                  <div className="mb-10 flex flex-col items-center">
                    <div className="relative group">
                      <div className={`w-36 h-36 rounded-[2rem] border-2 border-dashed ${formData.photo ? 'border-[#FF6B35]' : 'border-gray-200'} flex items-center justify-center overflow-hidden bg-[#FAFAFA] transition-all`}>
                        {formData.photo ? (
                          <img src={formData.photo} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-10 h-10 text-gray-300" />
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => formData.photo ? removePhoto() : fileInputRef.current?.click()}
                        className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl flex items-center justify-center shadow-xl transition-all ${formData.photo ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-gradient-to-br from-[#FF6B35] to-[#FF3D68] text-white hover:opacity-90'}`}
                      >
                        {formData.photo ? <X className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
                      </button>
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <p className="text-sm text-gray-400 mt-4 font-bold uppercase tracking-wider">Student Photo</p>
                    {errors.photo && <p className="text-xs text-red-500 mt-1">{errors.photo}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">First Name</label>
                      <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.firstName ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all font-light text-gray-600 placeholder:font-light placeholder:text-gray-400`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Last Name</label>
                      <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.lastName ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all font-light text-gray-600 placeholder:font-light placeholder:text-gray-400`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Father's Name</label>
                      <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} placeholder="Robert Doe" className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.fatherName ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all font-light text-gray-600 placeholder:font-light placeholder:text-gray-400`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Date of Birth</label>
                      <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.dob ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all font-light text-gray-600`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.gender ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all appearance-none font-light text-gray-600`}>
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 2: Contact & Security */}
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <Mail className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    Contact & Security
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Email Address</label>
                      <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.email ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all font-light text-gray-600 placeholder:font-light placeholder:text-gray-400`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Password (6-Digit PIN)</label>
                      <input 
                        type="password" 
                        name="password" 
                        value={formData.password} 
                        onChange={handleChange} 
                        placeholder="••••••" 
                        inputMode="numeric"
                        maxLength={6}
                        className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.password ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all font-light text-gray-600 placeholder:font-light placeholder:text-gray-400`} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Phone Number</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.phone ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all font-light text-gray-600 placeholder:font-light placeholder:text-gray-400`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Emergency Contact</label>
                      <input type="tel" name="emergencyContact" value={formData.emergencyContact} onChange={handleChange} placeholder="Emergency Phone" className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.emergencyContact ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all font-light text-gray-600 placeholder:font-light placeholder:text-gray-400`} />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Address</label>
                      <textarea name="address" value={formData.address} onChange={handleChange} rows={2} placeholder="Street, City, Zip Code" className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.address ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all resize-none font-light text-gray-600 placeholder:font-light placeholder:text-gray-400`} />
                    </div>
                  </div>
                </div>

                {/* Section 3: Academic Details */}
                <div>
                  <h3 className="text-2xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
                      <IdCard className="w-5 h-5 text-[#FF6B35]" />
                    </div>
                    Academic Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Course / Major</label>
                      <input type="text" name="course" value={formData.course} onChange={handleChange} placeholder="Computer Science" className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.course ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all font-light text-gray-600 placeholder:font-light placeholder:text-gray-400`} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Grade (Year)</label>
                      <select name="grade" value={formData.grade} onChange={handleChange} className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.grade ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all appearance-none font-light text-gray-600`}>
                        <option value="">Select...</option>
                        <option value="1">First Year</option>
                        <option value="2">Second Year</option>
                        <option value="3">Third Year</option>
                        <option value="4">Fourth Year</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700 uppercase tracking-widest ml-1">Enrollment Date</label>
                      <input type="date" name="enrollmentDate" value={formData.enrollmentDate} onChange={handleChange} className={`w-full px-5 py-4 bg-[#FAFAFA] border ${errors.enrollmentDate ? 'border-red-300' : 'border-gray-100'} rounded-2xl focus:ring-4 focus:ring-orange-50 focus:border-[#FF6B35] focus:outline-none transition-all font-light text-gray-600`} />
                    </div>
                  </div>
                </div>

                {response && !response.success && (
                  <div className="p-5 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-4 text-red-600 text-sm font-medium">
                    <AlertCircle className="w-5 h-5 shrink-0" /> {response.message}
                  </div>
                )}

                <div className="pt-8">
                  <button 
                    type="submit" 
                    disabled={isSubmitting} 
                    className="w-full py-5 bg-gradient-to-r from-[#FF6B35] to-[#FF3D68] text-white rounded-[1.5rem] font-bold text-xl shadow-xl shadow-orange-200 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-4 disabled:opacity-70"
                  >
                    {isSubmitting ? <Loader2 className="w-7 h-7 animate-spin" /> : <>Register Student <ArrowRight className="w-7 h-7" /></>}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
        
        <p className="text-center mt-10 text-gray-400 text-xs font-bold uppercase tracking-[0.2em]">
          © 2026 E-Tutoring System • Design V2.0
        </p>
      </motion.div>
    </div>
  );
}
