import { Test, TestingModule } from '@nestjs/testing';
import { Model } from "mongoose";
import { Product } from "./schemas/product.schema";
import { ProductService } from "./product.service";
import { getModelToken } from "@nestjs/mongoose";
import { FilterProductDTO } from './dtos/filter-product.dto';
const productList: Product[] = [
    new Product({ name: 'Miojo', description: 'Miojo turma da mônica', category: 'Macarrão', price: 1.99 }),
    new Product({ name: 'Miojo 2', description: 'Miojo', category: 'Macarrão', price: 1.99 })
];
const newProduct = { id: 1, name: 'Miojo', description: 'Miojo turma da mônica', category: 'Macarrão', price: 1.99 };


describe('ProductService', () => {
    let service: ProductService;
    let userModelMock: Model<Product>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ProductService,
                {
                    provide: getModelToken('Product'),
                    useFactory: () => ({
                        findById: jest.fn().mockReturnThis(),
                        create: jest.fn().mockReturnThis(),
                        findByIdAndRemove: jest.fn().mockReturnThis(),
                        findByIdAndUpdate: jest.fn().mockReturnThis(),
                        find: jest.fn().mockReturnThis(),
                        exec: jest.fn(),
                        save: jest.fn()
                    })
                }
            ]
        }).compile();
        service = module.get<ProductService>(ProductService);
        userModelMock = module.get<Model<Product>>(getModelToken(Product.name));
    });

    it('Test find by product', async () => {
        const productId = '123';

        (userModelMock.findById(1).exec as jest.Mock).mockResolvedValueOnce(newProduct);
        const result = await service.getProduct(productId);

        expect(result).toEqual(newProduct)

    })

    it('Test findAll products', async () => {
        (userModelMock.find().exec as jest.Mock).mockResolvedValue(productList);
        const result = await service.getAllProducts();
        expect(result).toEqual(productList)
    });

    it('Test create product', async () => {
        (userModelMock.create as jest.Mock).mockResolvedValue(newProduct);

        const result = await service.addProduct(newProduct);
        expect(result).toEqual(newProduct);
    });

    it('Test update product', async () => {
        (userModelMock.findByIdAndUpdate as jest.Mock).mockReturnValue(newProduct);
        const result = await service.updateProduct('1', newProduct);
        expect(result).toEqual(newProduct);
    });

    it('Teste delete product', async () => {
        (userModelMock.findByIdAndRemove as jest.Mock).mockResolvedValue(newProduct);
        const result = await service.deleteProduct('1');
        expect(result).toEqual(newProduct);
    });

    it('Test filteres products', async () => {
        (userModelMock.find().exec as jest.Mock).mockResolvedValue(productList);
        const filterPrd: FilterProductDTO = { category: 'Macarrão', search: 'Miojo', description: 'Miojo'};
        const result = await service.getFilteredProducts(filterPrd);
        expect(result).toEqual(productList);
    });





})