import { useState } from 'react'
import { useForm } from 'react-hook-form'
import styles from './Home.module.css'

const isSuccess = false
let data: unknown

interface IFormState {
	name: string
	email: string
}
interface getCount {
	countplayers: unknown
}

let countWaiters: number = 0

function Home() {
	const { register, handleSubmit, reset } = useForm<IFormState>()

	const [isSuccess, setIsSuccess] = useState(false)
	const [countWaiters, setCountWaiters] = useState(0)
	const [isLoading, setIsLoading] = useState(false)

	// Запрос на сервер на получение данных
	//*	const request = data => {
	//		const request = fetch('http://localhost:5000/api', {
	//	//	method: 'GET',
	//		body: null,
	//	})
	//		return await request.json()
	//	}

	let countplayers = 0
	const Loading = async data => {
		fetch('http://localhost:5000/api', {
			method: 'GET',
			body: null,
		})
			.then(response => response.json())
			.then(data => {
				if (!data) return
				if (countWaiters > data) return
				if (countWaiters < data) {
					countplayers = data
				}
			})
			.finally(() => {
				return setCountWaiters(countWaiters + countplayers)
			})

		console.log(countWaiters + countplayers)
	}

	// Запрос на сервер для добавления данных
	const onSubmit: SubmitHandler<IFormState> = data => {
		setIsLoading(true)
		fetch('http://localhost:5000/api', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(data),
		})
			.then(response => response.json())
			.then(data => {
				if (!data) return
				setIsSuccess(true)

				reset()
			})
			.finally(() => {
				setIsLoading(false)
			})
	}

	//request(data).then(data => {
	//	countplayers = data
	//	console.log(countplayers)
	//})

	return (
		<div className={styles.body} onLoad={Loading()}>
			<div className={styles.wrapper1}></div>
			<div className={styles.twoscreen}>
				{isSuccess ? (
					<h1>
						<a href='/'>Обнови страницу чтобы узнать!</a>
					</h1>
				) : (
					<h1>Уже более {countWaiters} игроков ждут GTA VI! Присоединяйся!</h1>
				)}
				<div className='img-person'>
					<img src='/person.png' alt='' />
				</div>
				<form onSubmit={handleSubmit(onSubmit)}>
					{isSuccess ? (
						<div className={styles.success}>Форма отправлена!</div>
					) : (
						<>
							<h1>GTA VI - Оставь заявку</h1>
							<input
								type='name'
								placeholder='Введите имя:'
								{...register('name')}
							/>
							<input
								type='email'
								placeholder='Введите Email:'
								{...register('email')}
							/>
							<button disabled={isLoading}>
								{isLoading ? 'Загрузка' : 'Xочу ГТА'}
							</button>
						</>
					)}
				</form>
			</div>
		</div>
	)
}

export default Home
