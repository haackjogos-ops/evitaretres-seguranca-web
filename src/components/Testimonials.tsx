import { useTestimonials } from "@/hooks/useTestimonials";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Testimonials = () => {
  const { testimonials, isLoading } = useTestimonials();

  if (isLoading) {
    return (
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <p className="text-muted-foreground">Carregando depoimentos...</p>
        </div>
      </section>
    );
  }

  const activeTestimonials = testimonials.filter((t) => t.is_active);

  if (activeTestimonials.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4 py-16 bg-muted/30">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          O que nossos clientes dizem
        </h2>
        <p className="text-xl text-muted-foreground">
          Depoimentos de quem confia em nosso trabalho
        </p>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-5xl mx-auto"
      >
        <CarouselContent>
          {activeTestimonials.map((testimonial) => (
            <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/3">
              <Card className="h-full">
                <CardContent className="p-6 flex flex-col h-full">
                  <Quote className="h-8 w-8 text-primary mb-4 opacity-50" />
                  
                  <p className="text-muted-foreground mb-6 flex-grow italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-2 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={testimonial.avatar_url || undefined} />
                      <AvatarFallback>
                        {testimonial.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      {testimonial.position && testimonial.company && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.position} - {testimonial.company}
                        </p>
                      )}
                      {testimonial.company && !testimonial.position && (
                        <p className="text-sm text-muted-foreground">
                          {testimonial.company}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
};

export default Testimonials;
