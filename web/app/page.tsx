'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
)

// Catálogo completo mundial de países, con sus códigos telefónicos y tipos de documentos oficiales correspondientes
const COUNTRIES = [
  { code: 'AF', name: 'Afganistán', phone: '+93', docTypes: ['NID', 'PAS'] },
  { code: 'AL', name: 'Albania', phone: '+355', docTypes: ['NIPT', 'PAS'] },
  { code: 'DE', name: 'Alemania', phone: '+49', docTypes: ['NPA', 'PAS'] },
  { code: 'AD', name: 'Andorra', phone: '+376', docTypes: ['NRT', 'PAS'] },
  { code: 'AO', name: 'Angola', phone: '+244', docTypes: ['BI', 'PAS'] },
  { code: 'AG', name: 'Antigua y Barbuda', phone: '+1 268', docTypes: ['ABN', 'PAS'] },
  { code: 'SA', name: 'Arabia Saudita', phone: '+966', docTypes: ['IQAMA', 'PAS'] },
  { code: 'DZ', name: 'Argelia', phone: '+213', docTypes: ['NIF', 'PAS'] },
  { code: 'AR', name: 'Argentina', phone: '+54', docTypes: ['DNI', 'CUIT', 'CUIL'] },
  { code: 'AM', name: 'Armenia', phone: '+374', docTypes: ['PAS', 'CSN'] },
  { code: 'AU', name: 'Australia', phone: '+61', docTypes: ['TFN', 'ABN'] },
  { code: 'AT', name: 'Austria', phone: '+43', docTypes: ['UID', 'PAS'] },
  { code: 'AZ', name: 'Azerbaiyán', phone: '+994', docTypes: ['PIN', 'PAS'] },
  { code: 'BS', name: 'Bahamas', phone: '+1 242', docTypes: ['NIN', 'PAS'] },
  { code: 'BD', name: 'Bangladés', phone: '+880', docTypes: ['NID', 'PAS'] },
  { code: 'BB', name: 'Barbados', phone: '+1 246', docTypes: ['NIS', 'PAS'] },
  { code: 'BH', name: 'Baréin', phone: '+973', docTypes: ['CPR', 'PAS'] },
  { code: 'BE', name: 'Bélgica', phone: '+32', docTypes: ['NISS', 'BTW'] },
  { code: 'BZ', name: 'Belice', phone: '+501', docTypes: ['SIN', 'PAS'] },
  { code: 'BJ', name: 'Benín', phone: '+229', docTypes: ['IFU', 'PAS'] },
  { code: 'BY', name: 'Bielorrusia', phone: '+375', docTypes: ['UNP', 'PAS'] },
  { code: 'MM', name: 'Birmania (Myanmar)', phone: '+95', docTypes: ['NRC', 'PAS'] },
  { code: 'BO', name: 'Bolivia', phone: '+591', docTypes: ['CI', 'NIT'] },
  { code: 'BA', name: 'Bosnia y Herzegovina', phone: '+387', docTypes: ['JMBG', 'PAS'] },
  { code: 'BW', name: 'Botsuana', phone: '+267', docTypes: ['OMANG', 'PAS'] },
  { code: 'BR', name: 'Brasil', phone: '+55', docTypes: ['CPF', 'CNPJ'] },
  { code: 'BN', name: 'Brunéi', phone: '+673', docTypes: ['IC', 'PAS'] },
  { code: 'BG', name: 'Bulgaria', phone: '+359', docTypes: ['EGN', 'UIC'] },
  { code: 'BF', name: 'Burkina Faso', phone: '+226', docTypes: ['CNIB', 'PAS'] },
  { code: 'BI', name: 'Burundi', phone: '+257', docTypes: ['NIF', 'PAS'] },
  { code: 'BT', name: 'Bután', phone: '+975', docTypes: ['CID', 'PAS'] },
  { code: 'CV', name: 'Cabo Verde', phone: '+238', docTypes: ['NIF', 'BI'] },
  { code: 'KH', name: 'Camboya', phone: '+855', docTypes: ['NID', 'PAS'] },
  { code: 'CM', name: 'Camerún', phone: '+237', docTypes: ['CNI', 'PAS'] },
  { code: 'CA', name: 'Canadá', phone: '+1', docTypes: ['SIN', 'BN'] },
  { code: 'QA', name: 'Catar', phone: '+974', docTypes: ['QID', 'PAS'] },
  { code: 'TD', name: 'Chad', phone: '+235', docTypes: ['NIF', 'PAS'] },
  { code: 'CL', name: 'Chile', phone: '+56', docTypes: ['RUT', 'RUN'] },
  { code: 'CN', name: 'China', phone: '+86', docTypes: ['RIC', 'USCC'] },
  { code: 'CY', name: 'Chipre', phone: '+357', docTypes: ['TIC', 'VAT'] },
  { code: 'VA', name: 'Ciudad del Vaticano', phone: '+39', docTypes: ['PAS', 'CV'] },
  { code: 'CO', name: 'Colombia', phone: '+57', docTypes: ['CC', 'CE', 'NIT', 'PAS'] },
  { code: 'KM', name: 'Comoras', phone: '+269', docTypes: ['NIF', 'PAS'] },
  { code: 'KP', name: 'Corea del Norte', phone: '+850', docTypes: ['RIC', 'PAS'] },
  { code: 'KR', name: 'Corea del Sur', phone: '+82', docTypes: ['RRN', 'BRN'] },
  { code: 'CI', name: 'Costa de Marfil', phone: '+225', docTypes: ['CNI', 'NCC'] },
  { code: 'CR', name: 'Costa Rica', phone: '+506', docTypes: ['CED', 'DIMEX', 'NIT'] },
  { code: 'HR', name: 'Croacia', phone: '+385', docTypes: ['OIB', 'PAS'] },
  { code: 'CU', name: 'Cuba', phone: '+53', docTypes: ['CI', 'NIT'] },
  { code: 'DK', name: 'Dinamarca', phone: '+45', docTypes: ['CPR', 'CVR'] },
  { code: 'DM', name: 'Dominica', phone: '+1 767', docTypes: ['NIN', 'PAS'] },
  { code: 'EC', name: 'Ecuador', phone: '+593', docTypes: ['CED', 'RUC', 'PAS'] },
  { code: 'EG', name: 'Egipto', phone: '+20', docTypes: ['NID', 'TAX'] },
  { code: 'SV', name: 'El Salvador', phone: '+503', docTypes: ['DUI', 'NIT'] },
  { code: 'AE', name: 'Emiratos Árabes Unidos', phone: '+971', docTypes: ['EID', 'TRN'] },
  { code: 'ER', name: 'Eritrea', phone: '+291', docTypes: ['NID', 'PAS'] },
  { code: 'SK', name: 'Eslovaquia', phone: '+421', docTypes: ['RC', 'DIC'] },
  { code: 'SI', name: 'Eslovenia', phone: '+386', docTypes: ['EMŠO', 'DAVČNA'] },
  { code: 'ES', name: 'España', phone: '+34', docTypes: ['DNI', 'NIE', 'NIF'] },
  { code: 'US', name: 'Estados Unidos', phone: '+1', docTypes: ['SSN', 'EIN', 'TAX'] },
  { code: 'EE', name: 'Estonia', phone: '+372', docTypes: ['IK', 'RR'] },
  { code: 'ET', name: 'Etiopía', phone: '+251', docTypes: ['TIN', 'PAS'] },
  { code: 'PH', name: 'Filipinas', phone: '+63', docTypes: ['PHILID', 'TIN'] },
  { code: 'FI', name: 'Finlandia', phone: '+358', docTypes: ['HETU', 'Y-TUNNUS'] },
  { code: 'FJ', name: 'Fiyi', phone: '+679', docTypes: ['TIN', 'PAS'] },
  { code: 'FR', name: 'Francia', phone: '+33', docTypes: ['NIR', 'SIRET'] },
  { code: 'GA', name: 'Gabón', phone: '+241', docTypes: ['NPI', 'PAS'] },
  { code: 'GM', name: 'Gambia', phone: '+220', docTypes: ['NIN', 'PAS'] },
  { code: 'GE', name: 'Georgia', phone: '+995', docTypes: ['PID', 'PAS'] },
  { code: 'GH', name: 'Ghana', phone: '+233', docTypes: ['GHN', 'TIN'] },
  { code: 'GD', name: 'Granada', phone: '+1 473', docTypes: ['NIN', 'PAS'] },
  { code: 'GR', name: 'Grecia', phone: '+30', docTypes: ['AFM', 'AMKA'] },
  { code: 'GT', name: 'Guatemala', phone: '+502', docTypes: ['DPI', 'NIT'] },
  { code: 'GN', name: 'Guinea', phone: '+224', docTypes: ['NIPE', 'PAS'] },
  { code: 'GW', name: 'Guinea-Bisáu', phone: '+245', docTypes: ['NIF', 'PAS'] },
  { code: 'GQ', name: 'Guinea Ecuatorial', phone: '+240', docTypes: ['NIF', 'PAS'] },
  { code: 'GY', name: 'Guyana', phone: '+592', docTypes: ['TIN', 'PAS'] },
  { code: 'HT', name: 'Haití', phone: '+509', docTypes: ['NIF', 'CIN'] },
  { code: 'HN', name: 'Honduras', phone: '+504', docTypes: ['DNI', 'RTN'] },
  { code: 'HU', name: 'Hungría', phone: '+36', docTypes: ['ADÓ', 'SZIG'] },
  { code: 'IN', name: 'India', phone: '+91', docTypes: ['AADHAAR', 'PAN'] },
  { code: 'ID', name: 'Indonesia', phone: '+62', docTypes: ['NIK', 'NPWP'] },
  { code: 'IQ', name: 'Irak', phone: '+964', docTypes: ['NID', 'PAS'] },
  { code: 'IR', name: 'Irán', phone: '+98', docTypes: ['NID', 'PAS'] },
  { code: 'IE', name: 'Irlanda', phone: '+353', docTypes: ['PPSN', 'TRN'] },
  { code: 'IS', name: 'Islandia', phone: '+354', docTypes: ['KT', 'VSK'] },
  { code: 'MH', name: 'Islas Marshall', phone: '+692', docTypes: ['NID', 'PAS'] },
  { code: 'SB', name: 'Islas Salomón', phone: '+677', docTypes: ['NID', 'PAS'] },
  { code: 'IL', name: 'Israel', phone: '+972', docTypes: ['TZ', 'HP'] },
  { code: 'IT', name: 'Italia', phone: '+39', docTypes: ['CF', 'PIVA'] },
  { code: 'JM', name: 'Jamaica', phone: '+1 876', docTypes: ['TRN', 'PAS'] },
  { code: 'JP', name: 'Japón', phone: '+81', docTypes: ['MyNo', 'CN'] },
  { code: 'JO', name: 'Jordania', phone: '+962', docTypes: ['NID', 'NAT'] },
  { code: 'KZ', name: 'Kazajistán', phone: '+7', docTypes: ['IIN', 'BIN'] },
  { code: 'KE', name: 'Kenia', phone: '+254', docTypes: ['NIN', 'PIN'] },
  { code: 'KG', name: 'Kirguistán', phone: '+996', docTypes: ['PIN', 'PAS'] },
  { code: 'KI', name: 'Kiribati', phone: '+686', docTypes: ['NID', 'PAS'] },
  { code: 'KW', name: 'Kuwait', phone: '+965', docTypes: ['CID', 'PAS'] },
  { code: 'LA', name: 'Laos', phone: '+856', docTypes: ['NID', 'PAS'] },
  { code: 'LS', name: 'Lesoto', phone: '+266', docTypes: ['NID', 'PAS'] },
  { code: 'LV', name: 'Letonia', phone: '+371', docTypes: ['PK', 'PVN'] },
  { code: 'LB', name: 'Líbano', phone: '+961', docTypes: ['NID', 'VAT'] },
  { code: 'LR', name: 'Liberia', phone: '+231', docTypes: ['NIN', 'PAS'] },
  { code: 'LY', name: 'Libia', phone: '+218', docTypes: ['NID', 'PAS'] },
  { code: 'LI', name: 'Liechtenstein', phone: '+423', docTypes: ['PE', 'PAS'] },
  { code: 'LT', name: 'Lituania', phone: '+370', docTypes: ['AK', 'PVM'] },
  { code: 'LU', name: 'Luxemburgo', phone: '+352', docTypes: ['NUID', 'TVA'] },
  { code: 'MK', name: 'Macedonia del Norte', phone: '+389', docTypes: ['EMB', 'EDBS'] },
  { code: 'MG', name: 'Madagascar', phone: '+261', docTypes: ['NIF', 'CIN'] },
  { code: 'MY', name: 'Malasia', phone: '+60', docTypes: ['MYKAD', 'BRN'] },
  { code: 'MW', name: 'Malaui', phone: '+265', docTypes: ['NID', 'TPIN'] },
  { code: 'MV', name: 'Maldivas', phone: '+960', docTypes: ['NID', 'PAS'] },
  { code: 'ML', name: 'Malí', phone: '+223', docTypes: ['NIF', 'NINA'] },
  { code: 'MT', name: 'Malta', phone: '+356', docTypes: ['NIN', 'VAT'] },
  { code: 'MA', name: 'Marruecos', phone: '+212', docTypes: ['CIN', 'ICE'] },
  { code: 'MU', name: 'Mauricio', phone: '+230', docTypes: ['NID', 'TAN'] },
  { code: 'MR', name: 'Mauritania', phone: '+222', docTypes: ['NNI', 'PAS'] },
  { code: 'MX', name: 'México', phone: '+52', docTypes: ['CURP', 'RFC', 'INE'] },
  { code: 'FM', name: 'Micronesia', phone: '+691', docTypes: ['NID', 'PAS'] },
  { code: 'MD', name: 'Moldavia', phone: '+373', docTypes: ['IDNO', 'IDNP'] },
  { code: 'MC', name: 'Mónaco', phone: '+377', docTypes: ['IM', 'RCI'] },
  { code: 'MN', name: 'Mongolia', phone: '+976', docTypes: ['RDN', 'TIN'] },
  { code: 'ME', name: 'Montenegro', phone: '+382', docTypes: ['JMB', 'PIB'] },
  { code: 'MZ', name: 'Mozambique', phone: '+258', docTypes: ['NUIT', 'BI'] },
  { code: 'NA', name: 'Namibia', phone: '+264', docTypes: ['NID', 'PAS'] },
  { code: 'NR', name: 'Nauru', phone: '+674', docTypes: ['NID', 'PAS'] },
  { code: 'NP', name: 'Nepal', phone: '+977', docTypes: ['NID', 'PAN'] },
  { code: 'NI', name: 'Nicaragua', phone: '+505', docTypes: ['CED', 'RUC'] },
  { code: 'NE', name: 'Níger', phone: '+227', docTypes: ['NIF', 'CNI'] },
  { code: 'NG', name: 'Nigeria', phone: '+234', docTypes: ['NIN', 'TIN'] },
  { code: 'NO', name: 'Noruega', phone: '+47', docTypes: ['FNR', 'MVA'] },
  { code: 'NZ', name: 'Nueva Zelanda', phone: '+64', docTypes: ['IRD', 'NZBN'] },
  { code: 'OM', name: 'Omán', phone: '+968', docTypes: ['CID', 'VAT'] },
  { code: 'NL', name: 'Países Bajos', phone: '+31', docTypes: ['BSN', 'BTW'] },
  { code: 'PK', name: 'Pakistán', phone: '+92', docTypes: ['CNIC', 'NTN'] },
  { code: 'PW', name: 'Palaos', phone: '+680', docTypes: ['NID', 'PAS'] },
  { code: 'PS', name: 'Palestina', phone: '+970', docTypes: ['NID', 'PAS'] },
  { code: 'PA', name: 'Panamá', phone: '+507', docTypes: ['CED', 'RUC'] },
  { code: 'PG', name: 'Papúa Nueva Guinea', phone: '+675', docTypes: ['NIN', 'TIN'] },
  { code: 'PY', name: 'Paraguay', phone: '+595', docTypes: ['CI', 'RUC'] },
  { code: 'PE', name: 'Perú', phone: '+51', docTypes: ['DNI', 'RUC', 'CE'] },
  { code: 'PL', name: 'Polonia', phone: '+48', docTypes: ['PESEL', 'NIP'] },
  { code: 'PT', name: 'Portugal', phone: '+351', docTypes: ['NIF', 'CC'] },
  { code: 'GB', name: 'Reino Unido', phone: '+44', docTypes: ['NINO', 'UTR'] },
  { code: 'CF', name: 'República Centroafricana', phone: '+236', docTypes: ['NIF', 'PAS'] },
  { code: 'CZ', name: 'República Checa', phone: '+420', docTypes: ['RC', 'DIC'] },
  { code: 'CG', name: 'República del Congo', phone: '+242', docTypes: ['NIF', 'PAS'] },
  { code: 'CD', name: 'República Democrática del Congo', phone: '+243', docTypes: ['NID', 'NAT'] },
  { code: 'DO', name: 'República Dominicana', phone: '+1 809', docTypes: ['CED', 'RNC'] },
  { code: 'RW', name: 'Ruanda', phone: '+250', docTypes: ['NID', 'TIN'] },
  { code: 'RO', name: 'Rumania', phone: '+40', docTypes: ['CNP', 'CUI'] },
  { code: 'RU', name: 'Rusia', phone: '+7', docTypes: ['INN', 'PAS'] },
  { code: 'WS', name: 'Samoa', phone: '+685', docTypes: ['NID', 'PAS'] },
  { code: 'KN', name: 'San Cristóbal y Nieves', phone: '+1 869', docTypes: ['TIN', 'PAS'] },
  { code: 'SM', name: 'San Marino', phone: '+378', docTypes: ['COE', 'PAS'] },
  { code: 'VC', name: 'San Vicente y las Granadinas', phone: '+1 784', docTypes: ['NIN', 'PAS'] },
  { code: 'LC', name: 'Santa Lucía', phone: '+1 758', docTypes: ['NIN', 'PAS'] },
  { code: 'ST', name: 'Santo Tomé y Príncipe', phone: '+239', docTypes: ['NIF', 'PAS'] },
  { code: 'SN', name: 'Senegal', phone: '+221', docTypes: ['NIN', 'NINEA'] },
  { code: 'RS', name: 'Serbia', phone: '+381', docTypes: ['JMBG', 'PIB'] },
  { code: 'SC', name: 'Seychelles', phone: '+248', docTypes: ['NIN', 'TIN'] },
  { code: 'SL', name: 'Sierra Leona', phone: '+232', docTypes: ['NIN', 'TIN'] },
  { code: 'SG', name: 'Singapur', phone: '+65', docTypes: ['NRIC', 'UEN'] },
  { code: 'SY', name: 'Siria', phone: '+963', docTypes: ['NID', 'PAS'] },
  { code: 'SO', name: 'Somalia', phone: '+252', docTypes: ['NID', 'PAS'] },
  { code: 'LK', name: 'Sri Lanka', phone: '+94', docTypes: ['NIC', 'TIN'] },
  { code: 'SZ', name: 'Suazilandia (Esuatini)', phone: '+268', docTypes: ['NIN', 'TIN'] },
  { code: 'ZA', name: 'Sudáfrica', phone: '+27', docTypes: ['ID', 'IT'] },
  { code: 'SD', name: 'Sudán', phone: '+249', docTypes: ['NID', 'TIN'] },
  { code: 'SS', name: 'Sudán del Sur', phone: '+211', docTypes: ['NID', 'PAS'] },
  { code: 'SE', name: 'Suecia', phone: '+46', docTypes: ['PNR', 'ORG'] },
  { code: 'CH', name: 'Suiza', phone: '+41', docTypes: ['AHV', 'MWST'] },
  { code: 'SR', name: 'Surinam', phone: '+597', docTypes: ['KKF', 'PAS'] },
  { code: 'TH', name: 'Tailandia', phone: '+66', docTypes: ['NID', 'TAX'] },
  { code: 'TW', name: 'Taiwán', phone: '+886', docTypes: ['NID', 'BAN'] },
  { code: 'TZ', name: 'Tanzania', phone: '+255', docTypes: ['NIDA', 'TIN'] },
  { code: 'TJ', name: 'Tayikistán', phone: '+992', docTypes: ['INN', 'PAS'] },
  { code: 'TL', name: 'Timor Oriental', phone: '+670', docTypes: ['NID', 'TIN'] },
  { code: 'TG', name: 'Togo', phone: '+228', docTypes: ['NIF', 'PAS'] },
  { code: 'TO', name: 'Tonga', phone: '+676', docTypes: ['NID', 'PAS'] },
  { code: 'TT', name: 'Trinidad y Tobago', phone: '+1 868', docTypes: ['NIN', 'BIR'] },
  { code: 'TN', name: 'Túnez', phone: '+216', docTypes: ['CIN', 'MF'] },
  { code: 'TM', name: 'Turkmenistán', phone: '+993', docTypes: ['PAS', 'NID'] },
  { code: 'TR', name: 'Turquía', phone: '+90', docTypes: ['TC', 'VKN'] },
  { code: 'TV', name: 'Tuvalu', phone: '+688', docTypes: ['NID', 'PAS'] },
  { code: 'UA', name: 'Ucrania', phone: '+380', docTypes: ['RNNOKP', 'EDRPOU'] },
  { code: 'UG', name: 'Uganda', phone: '+256', docTypes: ['NIN', 'TIN'] },
  { code: 'UY', name: 'Uruguay', phone: '+598', docTypes: ['CI', 'RUT'] },
  { code: 'UZ', name: 'Uzbekistán', phone: '+998', docTypes: ['PINFL', 'INN'] },
  { code: 'VU', name: 'Vanuatu', phone: '+678', docTypes: ['NID', 'PAS'] },
  { code: 'VE', name: 'Venezuela', phone: '+58', docTypes: ['V-', 'E-', 'J-', 'G-'] },
  { code: 'VN', name: 'Vietnam', phone: '+84', docTypes: ['CCCD', 'MST'] },
  { code: 'YE', name: 'Yemen', phone: '+967', docTypes: ['NID', 'PAS'] },
  { code: 'DJ', name: 'Yibuti', phone: '+253', docTypes: ['NIF', 'PAS'] },
  { code: 'ZM', name: 'Zambia', phone: '+260', docTypes: ['NRC', 'TPIN'] },
  { code: 'ZW', name: 'Zimbabue', phone: '+263', docTypes: ['NIN', 'TIN'] }
]

export default function Home() {
  const router = useRouter()
  const [isLoginMode, setIsLoginMode] = useState(true)

  // Estado del país seleccionado por defecto (Venezuela) o por geolocalización IP
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES.find(c => c.code === 'VE') || COUNTRIES[0])
  
  // Campos del formulario
  const [docType, setDocType] = useState('V-')
  const [docNumber, setDocNumber] = useState('')
  const [phonePrefix, setPhonePrefix] = useState('+58')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [nombre, setNombre] = useState('')
  const [password, setPassword] = useState('')
  const [mensaje, setMensaje] = useState('')

  // Detección automática de ubicación por IP al cargar el componente
  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data && data.country_code) {
          const found = COUNTRIES.find(c => c.code === data.country_code)
          if (found) {
            setSelectedCountry(found)
            setPhonePrefix(found.phone)
            setDocType(found.docTypes[0])
          }
        }
      })
      .catch(() => {
        // Silencioso en caso de error de red o bloqueadores
      })
  }, [])

  // Al cambiar de país de forma manual en el selector superior
  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const found = COUNTRIES.find(c => c.code === code)
    if (found) {
      setSelectedCountry(found)
      setPhonePrefix(found.phone)
      setDocType(found.docTypes[0])
    }
  }

  const handleDocNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocNumber(e.target.value.replace(/\D/g, ''))
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value.replace(/\D/g, ''))
  }

  const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value.toUpperCase())
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('')

    const documentoCompleto = `${docType}${docNumber}`

    try {
      let { data: existingClient, error: fetchError } = await supabase
        .from('clients')
        .select('*')
        .eq('cedula', documentoCompleto)
        .maybeSingle()

      if (fetchError) {
        setMensaje('Error en consulta: ' + fetchError.message)
        return
      }

      if (existingClient) {
        localStorage.setItem('fullstar_client', JSON.stringify(existingClient))
        router.push('/dashboard-loader')
      } else {
        setMensaje('El documento no está registrado. Por favor regístrese primero.')
      }
    } catch (err: any) {
      setMensaje('Error de conexión con la base de datos.')
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setMensaje('')

    const documentoCompleto = `${docType}${docNumber}`
    const telefonoCompleto = `${phonePrefix} ${phoneNumber}`

    try {
      let { data: existingClient } = await supabase
        .from('clients')
        .select('*')
        .eq('cedula', documentoCompleto)
        .maybeSingle()

      if (existingClient) {
        setMensaje('Este documento ya se encuentra registrado. Inicie sesión.')
        return
      }

      const { data: newClient, error: insertError } = await supabase
        .from('clients')
        .insert([{ 
          cedula: documentoCompleto, 
          telefono: telefonoCompleto, 
          nombre: nombre || 'CLIENTE FULLSTAR',
          password 
        }])
        .select()
        .single()

      if (insertError) {
        setMensaje('Error al registrar: ' + insertError.message)
      } else {
        localStorage.setItem('fullstar_client', JSON.stringify(newClient))
        router.push('/dashboard-loader')
      }
    } catch (err: any) {
      setMensaje('Error crítico al procesar el registro.')
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-3 sm:p-6 md:p-10">
      <div className="w-full max-w-xl bg-slate-900/90 backdrop-blur-xl border border-slate-800/80 rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-2xl">
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-full max-h-36 mb-4 flex justify-center items-center">
            <img 
              src="/logo.png" 
              alt="FULLSTAR Logo" 
              className="h-24 sm:h-32 w-auto object-contain drop-shadow-[0_0_25px_rgba(6,182,212,0.25)]" 
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 tracking-wide">
            FULLSTAR.dev
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-medium mt-1">
            Sistema de Licitación y Cotización de Proyectos
          </p>
        </div>

        {/* SELECTOR MUNDIAL DE PAÍSES (Geolocalizado por IP o manual) */}
        <div className="mb-6 p-3 bg-slate-950/80 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="text-xs font-mono uppercase text-cyan-400">🌍 País detectado / Seleccionado:</span>
          <select
            value={selectedCountry.code}
            onChange={handleCountryChange}
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm font-semibold focus:outline-none focus:border-cyan-500 cursor-pointer"
          >
            {COUNTRIES.map(c => (
              <option key={c.code} value={c.code}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
        </div>

        {/* Pestañas para alternar entre Iniciar Sesión y Registrarse */}
        <div className="flex border-b border-slate-800 mb-6">
          <button
            type="button"
            onClick={() => { setIsLoginMode(true); setMensaje(''); }}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
              isLoginMode 
                ? 'border-cyan-500 text-cyan-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setIsLoginMode(false); setMensaje(''); }}
            className={`flex-1 pb-3 text-sm font-bold transition-all border-b-2 ${
              !isLoginMode 
                ? 'border-cyan-500 text-cyan-400' 
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Registrarse
          </button>
        </div>

        {mensaje && (
          <div className="mb-6 p-4 bg-slate-950/80 border border-cyan-500/30 text-cyan-300 rounded-xl text-center text-sm shadow-inner font-mono">
            {mensaje}
          </div>
        )}

        {isLoginMode ? (
          /* FORMULARIO DE INICIO DE SESIÓN */
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Documento de Identidad</label>
              <div className="flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-cyan-500 transition-all">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="bg-slate-900 px-3 py-3 text-cyan-300 font-mono text-sm border-r border-slate-800 focus:outline-none cursor-pointer"
                >
                  {selectedCountry.docTypes.map(dt => (
                    <option key={dt} value={dt}>{dt}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  placeholder="Número de documento"
                  value={docNumber}
                  onChange={handleDocNumberChange}
                  className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-600 focus:outline-none text-sm sm:text-base font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-cyan-600 hover:bg-cyan-500 font-bold text-white py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-cyan-900/30 text-sm sm:text-base mt-2 cursor-pointer"
            >
              Entrar al Dashboard 🚀
            </button>
          </form>
        ) : (
          /* FORMULARIO DE REGISTRO */
          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Documento de Identidad</label>
              <div className="flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-cyan-500 transition-all">
                <select
                  value={docType}
                  onChange={(e) => setDocType(e.target.value)}
                  className="bg-slate-900 px-3 py-3 text-cyan-300 font-mono text-sm border-r border-slate-800 focus:outline-none cursor-pointer"
                >
                  {selectedCountry.docTypes.map(dt => (
                    <option key={dt} value={dt}>{dt}</option>
                  ))}
                </select>
                <input
                  type="text"
                  required
                  placeholder="Número de documento"
                  value={docNumber}
                  onChange={handleDocNumberChange}
                  className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-600 focus:outline-none text-sm sm:text-base font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Teléfono de Contacto</label>
              <div className="flex bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-cyan-500 transition-all">
                <input
                  type="text"
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  className="w-24 bg-slate-900 px-3 py-3 text-cyan-300 font-mono text-sm border-r border-slate-800 focus:outline-none text-center"
                />
                <input
                  type="text"
                  required
                  placeholder="Número telefónico"
                  value={phoneNumber}
                  onChange={handlePhoneChange}
                  className="w-full bg-transparent px-4 py-3 text-white placeholder-slate-600 focus:outline-none text-sm sm:text-base font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Nombre Completo o Empresa</label>
              <input
                type="text"
                required
                placeholder="TU NOMBRE O NEGOCIO"
                value={nombre}
                onChange={handleNombreChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base uppercase"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-slate-300 mb-1.5 uppercase tracking-wider">Contraseña</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-all text-sm sm:text-base"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 font-bold text-white py-3.5 sm:py-4 rounded-xl transition-all shadow-lg shadow-emerald-900/30 text-sm sm:text-base mt-2 cursor-pointer"
            >
              Registrarse y Acceder 🚀
            </button>
          </form>
        )}

      </div>
    </main>
  )
}
