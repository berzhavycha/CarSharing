export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const optionsDate: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short' };
  const optionsTime: Intl.DateTimeFormatOptions = { hour: '2-digit', minute: '2-digit' };

  const dayMonth = date.toLocaleDateString('en-GB', optionsDate).replace(',', '');
  const time = date.toLocaleTimeString('en-GB', optionsTime);

  return `${dayMonth}, ${time}`;
}
