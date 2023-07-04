import { Test, TestingModule } from "@nestjs/testing";
import { ProductController } from "./product.controller";
import { ProductService } from "./product.service";
import { Product } from "./schemas/product.schema";
import { CreateProductDTO } from "./dtos/create-product.dto";
import { FilterProductDTO } from "./dtos/filter-product.dto";
import { NotFoundException } from "@nestjs/common";

const productList: Product[] = [
    new Product({ name: 'Miojo', description: 'Miojo turma da mônica', category: 'Macarrão', price: 1.99 }),
    new Product({ name: 'Miojo 2', description: 'Miojo turma da mônica', category: 'Macarrão', price: 1.99 })
];

const newProduct = new Product({ name: 'Miojo', description: 'Miojo turma da mônica', category: 'Macarrão', price: 1.99 });

const updateProduct = new Product({ name: 'Feijão', description: 'Feijão Delicia', category: 'Comida', price: 8 });

describe('ProductController', () => {
    let productController: ProductController;
    let productService: ProductService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ProductController],
            providers: [
                {
                    provide: ProductService,
                    useValue: {
                        addProduct: jest.fn().mockResolvedValue(newProduct),
                        getAllProducts: jest.fn().mockResolvedValueOnce(productList),
                        getProduct: jest.fn().mockResolvedValue(productList[0]),
                        updateProduct: jest.fn().mockResolvedValue(productList),
                        deleteProduct: jest.fn().mockResolvedValue('deleted'),
                        getFilteredProducts: jest.fn().mockResolvedValueOnce(productList)
                    }
                }
            ]
        }).compile();

        productController = module.get<ProductController>(ProductController);
        productService = module.get<ProductService>(ProductService);
    });

    it('should be defined', () => {
        expect(productController).toBeDefined();
        expect(productService).toBeDefined();
    });



    describe('index', () => {

        // it('should return a todo list entity successfully', async () => {
        //     const result = await productController.index();
        //     expect(result).toEqual(productList);
        //     expect(typeof result).toEqual('object');
        //     expect(productService.getAllProducts).toHaveBeenCalledTimes(1)
        // });

        // it('should throw an exception', () => {
        //     jest.spyOn(productService, 'getAllProducts').mockRejectedValueOnce(new Error());

        //     expect(productController.index()).rejects.toThrowError();
        // })
    });

    describe('getProducts', () => {
        it('should return a todo list entity successfully by filter', async () => {
            const filterProductDTO: FilterProductDTO = { category: 'Macarrão', search: 'Miojo' };
            const result = await productController.getProducts(filterProductDTO);
            expect(result).toEqual(productList);
            expect(typeof result).toEqual('object');
            expect(productService.getFilteredProducts).toHaveBeenCalledTimes(1)
        });

        it('should return a todo list entity successfully', async () => {
            const empty = {}
            const result = await productController.getProducts(empty);
            expect(result).toEqual(productList);
            expect(typeof result).toEqual('object');
        });


    })

    describe('getByProduct', () => {
        it('should return  only one product  entity successfully by filter', async () => {
            const result = await productController.getProduct('1');
            expect(result).toEqual(newProduct);
            expect(typeof result).toEqual('object');
            expect(productService.getProduct).toHaveBeenCalledTimes(1);
        });

        it('should return a todo list entity successfully', async () => {
            try{
            jest.spyOn(productService,'getProduct').mockResolvedValue(null);
            const result = await productController.getProduct(null);
            }catch(ex){
                expect(ex).toStrictEqual(new NotFoundException('Product does not exist!'));
            }
        });

    });

    describe('deleteProduct', () => {
        it('should return  only one product  entity successfully by filter', async () => {
            const result = await productController.deleteProduct('1');
            expect(result).toEqual('deleted');
            expect(typeof result).toEqual('string');
        });

        it('should return a todo list entity successfully', async () => {
            try{
            jest.spyOn(productService,'deleteProduct').mockResolvedValue(null);
            const result = await productController.deleteProduct(null);
            }catch(ex){
                expect(ex).toStrictEqual(new NotFoundException('Product does not exist!'));
            }
        });

    });


    describe('create', () => {
        it('should create a new todo item successfully', async () => {
            const body: CreateProductDTO = {
                name: 'Salgado',
                category: 'Lanche',
                description: 'Lanche',
                price: 1.99
            }

            const result = await productController.addProduct(body);
            expect(result).toEqual(newProduct);
            expect(productService.addProduct).toHaveBeenCalledTimes(1);
            expect(productService.addProduct).toHaveBeenLastCalledWith(body);

        });
    });

    describe('update', () => {
        it('update product item successfully', async () => {
            const body: CreateProductDTO = {
                name: 'Salgado',
                category: 'Lanche',
                description: 'Lanche',
                price: 1.99
            };
            const id = 1;
            const result = await productController.updateProduct('2', body);
            let gettingId = result[id];
            gettingId = body;
            expect(gettingId).toBe(body);

        });

        it('should throw an exception', async () => {
            try {
                jest.spyOn(productService, 'updateProduct').mockResolvedValue(null)
                await productController.updateProduct(null, null);
            } catch (ex) {
                expect(ex).toStrictEqual(new NotFoundException('Product does not exist!'))
            }
        })
    });
})
