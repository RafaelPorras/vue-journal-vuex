import axios from "axios";
import cloudinary from 'cloudinary';
import uploadImage from "@/modules/daybook/helpers/uploadImage";


cloudinary.config({
    cloud_name: 'dp0nutowr',
    api_key: '576957312567624',
    api_secret: 'nUINIAj_Rb1QK6W3UZ9mscjSGmY'

})

describe('Pruebas en el uploadImage', () => {
    test('Debe de cargar un archivo y retornar el url', async( done ) => {

        jest.setTimeout(20000)

        const { data } = await axios.get('https://res.cloudinary.com/dp0nutowr/image/upload/v1693919894/cld-sample-2.jpg',{
            responseType: 'arraybuffer'
        })

        const file = new File([data], 'foto.jpg')

        const url = await uploadImage( file )

        expect( typeof url ).toBe('string')

        //Tomar el id
        const segments = url.split('/')
        const imageId = segments[segments.length - 1].replace('.jpg','')

        cloudinary.v2.api.delete_resources(imageId, {}, () => {
             done()
         })

    })
})