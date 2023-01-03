/* UseEffect:

  Dificilmente será utilizado para atualizar estado.

*/

import { createContext, useContext, useState } from "react"
import { HomeContainer, StartButton, StopButton } from "./styles"
import { Play, HandPalm } from "phosphor-react"

import { useForm, FormProvider } from 'react-hook-form'
import * as zod from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { NewCycleForm } from "./NewCycleForm"
import { CountDown } from "./Countdown"
import { CyclesContext } from "../../contexts/CyclesContext"

// Validação do formulário usando zod
const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number()
    .min(1, 'O tempo mínimo é 5 minutos')
    .max(60, 'O tempo máximo é 60 minutos') // usar formState.errors para mostrar mensagem
})
  
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {

  const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0
    }
  })

  const { handleSubmit, watch, reset } = newCycleForm


  // 'handle' para funções que são disparadas em eventos
  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data)
    reset()
  }

  // guarda valor do input task em tempo real
  const task = watch('task')
  const isSubmitDisabled = !task


  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>
          <CountDown />

        {
          activeCycle ? (
            <StopButton 
            type="button"
            onClick={interruptCurrentCycle}
          >
            <HandPalm size="24"/>
            Interromper
          </StopButton>
          ) : (
            <StartButton 
              type="submit"
              disabled={isSubmitDisabled}
            >
              <Play size="24"/>
              Começar
            </StartButton>
          )
        }

      </form>
    </HomeContainer>
  )
}
