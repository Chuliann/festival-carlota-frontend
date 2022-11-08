

export const chequearCodigo = async () => {
    try {
        const response = await fetch(`http://localhost/api/create-checkout-session.php`);
        const data = await response.json();
        if(response.status === 200) {
          console.log(data);
        }
      } catch (error) {
        console.log(error);
      }
}