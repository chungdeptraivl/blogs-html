let header = document.querySelector('header')
const imageManageAccount = document.getElementsByClassName('avt-account')[0]
const showManageAccount = document.getElementsByClassName('account-manage')[0]

window.addEventListener('scroll', () => {
    header.classList.toggle("shadow", window.scrollY > 0)
})

imageManageAccount.addEventListener('click', () => {
    showManageAccount.classList.toggle('show')
})