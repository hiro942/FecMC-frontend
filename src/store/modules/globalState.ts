import { defineStore } from 'pinia'

const useGlobalStateStore = defineStore('globalState', () => {
  const searchTaskName = ''
  const filterTaskState = ''

  const userInfoResetModalVisible = false
  const taskDetailModalVisible = false
  const taskAcceptModalVisible = false
  const taskResultModalVisible = false
  const blockDetailModalVisible = false
  const transactionModalVisible = false

  return {
    searchTaskName,
    filterTaskState,
    userInfoResetModalVisible,
    taskDetailModalVisible,
    taskAcceptModalVisible,
    taskResultModalVisible,
    blockDetailModalVisible,
    transactionModalVisible,
  }
})

export default useGlobalStateStore
