import { ReactRouter } from 'decky-frontend-lib'

export const useParams = Object.values(ReactRouter).find((val) =>
  /return (\w)\?\1\.params:{}/.test(`${val}`)
) as <T>() => T;