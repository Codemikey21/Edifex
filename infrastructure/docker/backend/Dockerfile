FROM php:8.4-fpm-alpine

RUN apk add --no-cache \
    bash \
    curl \
    zip \
    unzip \
    git \
    libpq-dev \
    libzip-dev \
    oniguruma-dev \
    libxml2-dev \
    linux-headers \
    autoconf \
    g++ \
    make

RUN docker-php-ext-install \
    pdo \
    pdo_pgsql \
    pgsql \
    mbstring \
    zip \
    bcmath \
    xml \
    pcntl \
    sockets

RUN pecl install redis && docker-php-ext-enable redis

RUN apk del autoconf g++ make

COPY --from=composer:2.7 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-interaction --prefer-dist --optimize-autoloader

RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 8000

CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]