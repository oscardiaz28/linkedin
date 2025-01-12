export function timeAgo(date: Date): string {
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) {
      return interval === 1 ? "1 año" : `${interval} años`;
    }
  
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) {
      return interval === 1 ? "1 mes" : `${interval} meses`;
    }
  
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) {
      return interval === 1 ? "1 dia" : `${interval} dias`;
    }
  
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) {
      return interval === 1 ? "1 hora" : `${interval} horas`;
    }
  
    interval = Math.floor(seconds / 60);
    if (interval >= 1) {
      return interval === 1 ? "1 minuto" : `${interval} minutos`;
    }
  
    return "Hace un momento";
  }