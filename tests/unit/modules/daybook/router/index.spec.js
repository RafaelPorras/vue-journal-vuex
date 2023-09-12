import dayBookRouter from '../../../../../src/modules/daybook/router'

describe('Pruebas en el router module del Daybook', () => {
    test('el router debe de tener esta configuracion', async () => {
        
       expect( dayBookRouter ).toMatchObject({
            name:'daybook',
            component: expect.any( Function ),
            children:[
                {
                    path:'',
                    name:'no-entry',
                    component:expect.any( Function ),
                },
                {
                    path:':id',
                    name:'entry',
                    component:expect.any( Function ),
                    props: expect.any( Function ),
                }
            ]
        })

        // De esta forma dependemos que las rutas no se puedan cambiar de posicion
        //expect( (await dayBookRouter.children[0].component()).default.name ).toBe('NoEntrySelected')
        //expect( (await dayBookRouter.children[1].component()).default.name ).toBe('EntryView')

        const promiseRoutes = []
        dayBookRouter.children.forEach( child => promiseRoutes.push( child.component() ))

        const routes = (await Promise.all( promiseRoutes )).map( route => route.default.name)

        expect( routes ).toContain('NoEntrySelected')
        expect( routes ).toContain('EntryView')


    })

    test('Debe de retornar el id de la ruta', () => {
        const route = {
            params:{
                id: 'ABC-123'
            }
        }

        // El problem de esto es que no se puede cambiar la ruta de orden en el router/index.js
        //expect( dayBookRouter.children[1].props(route) ).toEqual( { id: 'ABC-123'} )

        const entryRoute = dayBookRouter.children.find( route => route.name === 'entry')
        expect( entryRoute.props(route) ).toEqual( { id: 'ABC-123'} )

    })
})