

export const usarCupon = async (cupon) => {
    const body = {
      codigo: cupon
    }
    try {
      await fetch("http://localhost/acceso/api/usar_cupon.php", {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(response => response.json())
      .then(data => console.log(data));
      
    } catch (error) {
      console.log(error);
    }
}
