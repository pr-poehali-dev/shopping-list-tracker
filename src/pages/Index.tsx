import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
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

  const [photoDialogOpen, setPhotoDialogOpen] = useState<string | null>(null);
  const [tempPhoto, setTempPhoto] = useState<string | null>(null);
  
  const [hintDialogOpen, setHintDialogOpen] = useState<string | null>(null);
  const [tempHint, setTempHint] = useState("");
  
  const [skuDialogOpen, setSkuDialogOpen] = useState<string | null>(null);
  const [tempSku, setTempSku] = useState("");
  
  const [sellingPriceDialogOpen, setSellingPriceDialogOpen] = useState<string | null>(null);
  const [tempSellingPrice, setTempSellingPrice] = useState("");
  
  const [purchasePriceDialogOpen, setPurchasePriceDialogOpen] = useState<string | null>(null);
  const [tempPurchasePrice, setTempPurchasePrice] = useState("");

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

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTempPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const openPhotoDialog = (id: string) => {
    const product = products.find(p => p.id === id);
    setTempPhoto(product?.photo || null);
    setPhotoDialogOpen(id);
  };

  const confirmPhoto = () => {
    if (photoDialogOpen && tempPhoto) {
      updateProduct(photoDialogOpen, "photo", tempPhoto);
      toast.success("Фото загружено");
    }
    setPhotoDialogOpen(null);
    setTempPhoto(null);
  };

  const cancelPhoto = () => {
    setPhotoDialogOpen(null);
    setTempPhoto(null);
  };

  const openHintDialog = (id: string) => {
    const product = products.find(p => p.id === id);
    setTempHint(product?.hint || "");
    setHintDialogOpen(id);
  };

  const confirmHint = () => {
    if (hintDialogOpen) {
      updateProduct(hintDialogOpen, "hint", tempHint);
      toast.success("Подсказка сохранена");
    }
    setHintDialogOpen(null);
    setTempHint("");
  };

  const cancelHint = () => {
    setHintDialogOpen(null);
    setTempHint("");
  };

  const openSkuDialog = (id: string) => {
    const product = products.find(p => p.id === id);
    setTempSku(product?.sku || "");
    setSkuDialogOpen(id);
  };

  const confirmSku = () => {
    if (skuDialogOpen) {
      updateProduct(skuDialogOpen, "sku", tempSku);
      toast.success("Артикул сохранен");
    }
    setSkuDialogOpen(null);
    setTempSku("");
  };

  const cancelSku = () => {
    setSkuDialogOpen(null);
    setTempSku("");
  };

  const openSellingPriceDialog = (id: string) => {
    const product = products.find(p => p.id === id);
    setTempSellingPrice(product?.sellingPrice?.toString() || "");
    setSellingPriceDialogOpen(id);
  };

  const confirmSellingPrice = () => {
    if (sellingPriceDialogOpen && tempSellingPrice) {
      updateProduct(sellingPriceDialogOpen, "sellingPrice", parseFloat(tempSellingPrice));
      toast.success("Цена продажи зафиксирована");
    }
    setSellingPriceDialogOpen(null);
    setTempSellingPrice("");
  };

  const cancelSellingPrice = () => {
    setSellingPriceDialogOpen(null);
    setTempSellingPrice("");
  };

  const openPurchasePriceDialog = (id: string) => {
    const product = products.find(p => p.id === id);
    setTempPurchasePrice(product?.purchasePrice?.toString() || "");
    setPurchasePriceDialogOpen(id);
  };

  const confirmPurchasePrice = () => {
    if (purchasePriceDialogOpen && tempPurchasePrice) {
      updateProduct(purchasePriceDialogOpen, "purchasePrice", parseFloat(tempPurchasePrice));
      toast.success("Цена покупки зафиксирована");
    }
    setPurchasePriceDialogOpen(null);
    setTempPurchasePrice("");
  };

  const cancelPurchasePrice = () => {
    setPurchasePriceDialogOpen(null);
    setTempPurchasePrice("");
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
          <div className="flex items-center gap-6 mb-8">
            <img 
              src="https://cdn.poehali.dev/files/4a353bde-4165-4e53-90dd-6a736abe41d4.png" 
              alt="CARFIX Logo" 
              className="h-12 md:h-16 w-auto"
            />
          </div>
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
                <button 
                  onClick={() => openPhotoDialog(product.id)}
                  className="w-full md:w-24 h-24 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary transition-colors flex-shrink-0"
                >
                  {product.photo ? (
                    <img src={product.photo} alt="Товар" className="w-full h-full object-cover rounded-lg" />
                  ) : (
                    <Icon name="Image" size={32} className="text-gray-400" />
                  )}
                </button>

                <div className="flex-1 w-full space-y-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full sm:w-auto"
                      onClick={() => openHintDialog(product.id)}
                    >
                      <Icon name="Lightbulb" size={16} className="mr-2" />
                      Подсказка {product.hint && "✓"}
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1 justify-start text-left"
                      onClick={() => openSkuDialog(product.id)}
                    >
                      {product.sku || "Артикул товара"}
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Button
                      variant="outline"
                      className="justify-start text-left"
                      onClick={() => openSellingPriceDialog(product.id)}
                    >
                      {product.sellingPrice ? `Продажа: ${product.sellingPrice} ₽` : "Цена продажи"}
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start text-left"
                      onClick={() => openPurchasePriceDialog(product.id)}
                    >
                      {product.purchasePrice ? `Покупка: ${product.purchasePrice} ₽` : "Цена покупки"}
                    </Button>
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

      <Dialog open={photoDialogOpen !== null} onOpenChange={(open) => !open && cancelPhoto()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Фото товара</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {tempPhoto ? (
              <img src={tempPhoto} alt="Товар" className="w-full rounded-lg" />
            ) : (
              <div className="text-center py-12 text-gray-500">Фото не загружено</div>
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="cursor-pointer"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelPhoto}>
              <Icon name="X" size={18} className="mr-2" />
              Отменить
            </Button>
            <Button onClick={confirmPhoto} disabled={!tempPhoto}>
              <Icon name="Check" size={18} className="mr-2" />
              Принять
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={hintDialogOpen !== null} onOpenChange={(open) => !open && cancelHint()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Где найти товар</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Введите подсказку где найти этот товар..."
            value={tempHint}
            onChange={(e) => setTempHint(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelHint}>
              <Icon name="X" size={18} className="mr-2" />
              Отменить
            </Button>
            <Button onClick={confirmHint}>
              <Icon name="Check" size={18} className="mr-2" />
              Принять
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={skuDialogOpen !== null} onOpenChange={(open) => !open && cancelSku()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Артикул товара</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Введите артикул товара..."
            value={tempSku}
            onChange={(e) => setTempSku(e.target.value)}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelSku}>
              <Icon name="X" size={18} className="mr-2" />
              Отменить
            </Button>
            <Button onClick={confirmSku}>
              <Icon name="Check" size={18} className="mr-2" />
              Принять
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sellingPriceDialogOpen !== null} onOpenChange={(open) => !open && cancelSellingPrice()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Цена продажи</DialogTitle>
          </DialogHeader>
          <Input
            type="number"
            placeholder="Введите цену продажи..."
            value={tempSellingPrice}
            onChange={(e) => setTempSellingPrice(e.target.value)}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelSellingPrice}>
              <Icon name="X" size={18} className="mr-2" />
              Отменить
            </Button>
            <Button onClick={confirmSellingPrice} disabled={!tempSellingPrice}>
              <Icon name="Check" size={18} className="mr-2" />
              Принять
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={purchasePriceDialogOpen !== null} onOpenChange={(open) => !open && cancelPurchasePrice()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Цена покупки</DialogTitle>
          </DialogHeader>
          <Input
            type="number"
            placeholder="Введите цену покупки..."
            value={tempPurchasePrice}
            onChange={(e) => setTempPurchasePrice(e.target.value)}
          />
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={cancelPurchasePrice}>
              <Icon name="X" size={18} className="mr-2" />
              Отменить
            </Button>
            <Button onClick={confirmPurchasePrice} disabled={!tempPurchasePrice}>
              <Icon name="Check" size={18} className="mr-2" />
              Принять
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
