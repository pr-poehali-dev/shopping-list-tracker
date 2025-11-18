import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/ui/icon";
import { toast } from "sonner";

interface Product {
  id: string;
  photo: string | null;
  hint: string;
  sku: string;
  sellingPrice: number | null;
  purchasePrice: number | null;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const addProduct = () => {
    const newProduct: Product = {
      id: Date.now().toString(),
      photo: null,
      hint: "",
      sku: "",
      sellingPrice: null,
      purchasePrice: null,
    };
    setProducts([...products, newProduct]);
    setEditingId(newProduct.id);
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast.success("Товар удален");
  };

  const updateProduct = (id: string, field: keyof Product, value: any) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handlePhotoUpload = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateProduct(id, "photo", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const confirmPrice = (id: string, type: "sellingPrice" | "purchasePrice") => {
    toast.success(`${type === "sellingPrice" ? "Цена продажи" : "Цена покупки"} зафиксирована`);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hint.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Учет товаров</h1>
          
          <div className="relative mb-6">
            <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Поиск по артикулу или названию товара..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>

          <Button onClick={addProduct} className="w-full md:w-auto h-12 text-base font-medium">
            <Icon name="Plus" size={20} className="mr-2" />
            Добавить товар
          </Button>
        </div>

        <div className="space-y-4">
          {filteredProducts.length === 0 && searchQuery === "" && (
            <div className="text-center py-12 text-gray-500">
              Нажмите "Добавить товар" чтобы начать
            </div>
          )}
          
          {filteredProducts.length === 0 && searchQuery !== "" && (
            <div className="text-center py-12 text-gray-500">
              Товары не найдены
            </div>
          )}

          {filteredProducts.map((product) => (
            <Card key={product.id} className="p-4 md:p-6 animate-fade-in">
              <div className="flex flex-col md:flex-row gap-4 items-start">
                <Dialog>
                  <DialogTrigger asChild>
                    <button className="w-full md:w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors flex-shrink-0">
                      {product.photo ? (
                        <img src={product.photo} alt="Товар" className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Icon name="Image" size={32} className="text-gray-400" />
                      )}
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Фото товара</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {product.photo ? (
                        <img src={product.photo} alt="Товар" className="w-full rounded-lg" />
                      ) : (
                        <div className="text-center py-12 text-gray-500">Фото не загружено</div>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(product.id, e)}
                        className="cursor-pointer"
                      />
                    </div>
                  </DialogContent>
                </Dialog>

                <div className="flex-1 w-full space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full sm:w-auto">
                          <Icon name="Lightbulb" size={16} className="mr-2" />
                          Подсказка
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Где найти товар</DialogTitle>
                        </DialogHeader>
                        <Textarea
                          placeholder="Введите подсказку где найти этот товар..."
                          value={product.hint}
                          onChange={(e) => updateProduct(product.id, "hint", e.target.value)}
                          rows={4}
                          className="resize-none"
                        />
                      </DialogContent>
                    </Dialog>

                    <Input
                      placeholder="Артикул товара"
                      value={product.sku}
                      onChange={(e) => updateProduct(product.id, "sku", e.target.value)}
                      className="flex-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Цена продажи"
                        value={product.sellingPrice ?? ""}
                        onChange={(e) => updateProduct(product.id, "sellingPrice", e.target.value ? parseFloat(e.target.value) : null)}
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant={product.sellingPrice ? "default" : "outline"}
                        onClick={() => confirmPrice(product.id, "sellingPrice")}
                        disabled={!product.sellingPrice}
                      >
                        <Icon name="Check" size={18} />
                      </Button>
                    </div>

                    <div className="flex gap-2">
                      <Input
                        type="number"
                        placeholder="Цена покупки"
                        value={product.purchasePrice ?? ""}
                        onChange={(e) => updateProduct(product.id, "purchasePrice", e.target.value ? parseFloat(e.target.value) : null)}
                        className="flex-1"
                      />
                      <Button
                        size="icon"
                        variant={product.purchasePrice ? "default" : "outline"}
                        onClick={() => confirmPrice(product.id, "purchasePrice")}
                        disabled={!product.purchasePrice}
                      >
                        <Icon name="Check" size={18} />
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => setEditingId(editingId === product.id ? null : product.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <Icon name="Pencil" size={18} />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => deleteProduct(product.id)}
                    className="flex-1 sm:flex-none"
                  >
                    <Icon name="X" size={18} />
                  </Button>
                </div>
              </div>

              {product.sellingPrice && product.purchasePrice && (
                <div className="mt-4 pt-4 border-t flex justify-between text-sm">
                  <span className="text-gray-600">Маржа:</span>
                  <span className={`font-medium ${product.sellingPrice - product.purchasePrice > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(product.sellingPrice - product.purchasePrice).toFixed(2)} ₽
                    {" "}
                    ({((product.sellingPrice - product.purchasePrice) / product.purchasePrice * 100).toFixed(1)}%)
                  </span>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
