import appPreviewImage from '../assets/app-nlw-copa-preview.png'
import logoImage from '../assets/logo.svg'
import iconCheck from '../assets/icon-check.svg'
import avatarUsersExempleImage from '../assets/users-avatar-exemple.png'
import Image from 'next/image'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps {
  poolCount: number
  guessCount: number
  userCount: number
}

export default function Home(props:HomeProps) {

  const [poolTitle, setPoolTitle] = useState('')

  async function createPool(event: FormEvent){
    event.preventDefault()

    try {
      const poolCreated = await api.post('pools',{
        title: poolTitle
      });

      const {code} = poolCreated.data
      await navigator.clipboard.writeText(code)
      alert('Bolão criado com sucesso, código copiado para a area de transferencia.')
      setPoolTitle('')
    } catch (error) {
      console.log(error)
      alert('Falha ao criar o bolão, tente novamente.')
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image
          src={logoImage}
          alt="Logomarca da NLW edição Copa"
          quality={100}
        />

        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image
            src={avatarUsersExempleImage}
            alt=""
            quality={100}
          />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{props.userCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2 ' >
          <input
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-200'
            type="text" 
            required 
            placeholder='Qual nome do seu bolão?'
            onChange={event=>setPoolTitle(event.target.value)}
            value={poolTitle}
          />
          <button 
            type="submit"
            className='bg-yellow-500 rounded px-6 py-4 font-bold text-gray-900 text-sm uppercase hover:bg-yellow-700 transition'
          >
            Criar meu bolão
          </button>
        </form>
        <p className='text-gray-300 text-sm mt-4 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex justify-between text-gray-300'>
          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt=""/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl text-gray-100'>+{props.poolCount}</span>
              <span className='text-sm'>Bolões criados</span>
            </div>
          </div>

          <div className='w-px h-auto bg-gray-600'/>

          <div className='flex items-center gap-6'>
            <Image src={iconCheck} alt=""/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl text-gray-100'>+{props.guessCount}</span>
              <span className='text-sm'>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image 
        src={appPreviewImage} 
        alt="Dois celulares exibindo uma prévia da aplicação móvel NLW copa"
        quality={100}
      />
        
    </div>
  )
}


// export const getServerSideProps = async () =>{
//   const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
//     api.get('pools/count'),
//     api.get('guesses/count'),
//     api.get('users/count')
//   ])
  
//   return {
//     props : {
//       poolCount: poolCountResponse.data.countPools,
//       guessCount: guessCountResponse.data.countGuess,
//       userCount: usersCountResponse.data.countUsers,
//     }
//   }
// }

export const getStaticProps = async () =>{
  const [poolCountResponse, guessCountResponse, usersCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])
  
  return {
    props : {
      poolCount: poolCountResponse.data.countPools,
      guessCount: guessCountResponse.data.countGuess,
      userCount: usersCountResponse.data.countUsers,
    },
    revalidate: 10
  }
}

