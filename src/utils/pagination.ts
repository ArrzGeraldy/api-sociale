export const getPagination = (total: number, limit: number, numberPage: number) => {
  const lastPage = Math.max(1, Math.ceil(total / limit))
  const nextPage = numberPage >= lastPage ? false : true

  const pagination = {
    lastPage,
    nextPage
  }

  return pagination
}
