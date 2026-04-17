<?php

namespace App\Extensions;

use Tymon\JWTAuth\JWTGuard as BaseJWTGuard;

class JWTGuard extends BaseJWTGuard
{
    protected function validateSubject()
    {
        if (! $this->provider) {
            return true;
        }

        if (! method_exists($this->provider, 'getModel')) {
            return true;
        }

        return $this->jwt->checkSubjectModel($this->provider->getModel());
    }
}
