
const pad = (number) => {
  var r = String(number);
  if ( r.length === 1 ) {
    r = '0' + r;
  }
  return r;
}

export const getNowHourISO = () => {
  const now = new Date()

  now.setHours(now.getHours() - 1);

  return now.getUTCFullYear()
    + '-' + pad(now.getUTCMonth() + 1)
    + '-' + pad(now.getUTCDate())
    + 'T' + pad(now.getUTCHours() )
    + ':00:00.000Z'
}


export const getMonthAgoHourISO = () => {
  const now = new Date()

  now.setDate( now.getDate() - 60)

  return now.getUTCFullYear()
    + '-' + pad(now.getUTCMonth() + 1)
    + '-' + pad(now.getUTCDate())
    + 'T' + pad(now.getUTCHours())
    + ':00:00.000Z'
}
